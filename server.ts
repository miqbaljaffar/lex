import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const prisma = new PrismaClient();

// Request body validation schema
const analyzeSchema = z.object({
  title: z.string().min(5, "Judul kasus minimal 5 karakter."),
  chronology: z.string().min(20, "Deskripsi kronologi minimal 20 karakter."),
  category: z.string().min(3, "Kategori wajib dipilih."),
  evidence: z.string().optional().nullable()
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Get active user email from environment variables, fallback to guest email
  const DEFAULT_USER_ID = process.env.DEFAULT_USER_EMAIL || "guest@lexai.internal";

  // API Endpoints
  // Get logged-in user profile
  app.get("/api/user/profile", (req, res) => {
    res.json({ email: DEFAULT_USER_ID });
  });
  // Get all cases
  app.get("/api/cases", async (req, res) => {
    try {
      const userCases = await prisma.case.findMany({
        where: { userId: DEFAULT_USER_ID },
        orderBy: { createdAt: "desc" }
      });
      res.json(userCases);
    } catch (err: any) {
      console.error("Error fetching cases:", err);
      res.status(500).json({ error: "Gagal mengambil data kasus: " + err.message });
    }
  });

  // Get specific case
  app.get("/api/cases/:id", async (req, res) => {
    try {
      const caseItem = await prisma.case.findFirst({
        where: { id: req.params.id, userId: DEFAULT_USER_ID }
      });
      if (!caseItem) {
        return res.status(404).json({ error: "Kasus tidak ditemukan" });
      }
      res.json(caseItem);
    } catch (err: any) {
      console.error("Error fetching case detail:", err);
      res.status(500).json({ error: "Gagal mengambil detail kasus: " + err.message });
    }
  });

  // Toggle bookmark
  app.post("/api/cases/:id/bookmark", async (req, res) => {
    try {
      const caseItem = await prisma.case.findFirst({
        where: { id: req.params.id, userId: DEFAULT_USER_ID }
      });
      if (!caseItem) {
        return res.status(404).json({ error: "Kasus tidak ditemukan" });
      }

      const updatedCase = await prisma.case.update({
        where: { id: req.params.id },
        data: { isBookmarked: !caseItem.isBookmarked }
      });
      
      await prisma.history.create({
        data: {
          caseId: req.params.id,
          userId: DEFAULT_USER_ID,
          action: updatedCase.isBookmarked ? "bookmarked" : "unbookmarked"
        }
      });

      res.json(updatedCase);
    } catch (err: any) {
      console.error("Error toggling bookmark:", err);
      res.status(500).json({ error: "Gagal memperbarui bookmark: " + err.message });
    }
  });

  // Delete case
  app.delete("/api/cases/:id", async (req, res) => {
    try {
      const caseItem = await prisma.case.findFirst({
        where: { id: req.params.id, userId: DEFAULT_USER_ID }
      });
      if (!caseItem) {
        return res.status(404).json({ error: "Kasus tidak ditemukan" });
      }
      
      const id = req.params.id;
      await prisma.case.delete({
        where: { id }
      });

      await prisma.history.deleteMany({
        where: { caseId: id }
      });

      res.json({ message: "Kasus berhasil dihapus" });
    } catch (err: any) {
      console.error("Error deleting case:", err);
      res.status(500).json({ error: "Gagal menghapus kasus: " + err.message });
    }
  });

  // Get active history
  app.get("/api/history", async (req, res) => {
    try {
      const userHistory = await prisma.history.findMany({
        where: { userId: DEFAULT_USER_ID },
        orderBy: { timestamp: "desc" }
      });

      const caseIds = Array.from(new Set(userHistory.map((h: any) => h.caseId)));
      const cases = await prisma.case.findMany({
        where: { id: { in: caseIds } },
        select: { id: true, title: true }
      });

      const caseMap = new Map(cases.map((c: any) => [c.id, c.title]));

      const formattedHistory = userHistory.map((h: any) => ({
        ...h,
        caseTitle: caseMap.get(h.caseId) || "Kasus Dihapus"
      }));

      res.json(formattedHistory);
    } catch (err: any) {
      console.error("Error fetching history:", err);
      res.status(500).json({ error: "Gagal mengambil log riwayat: " + err.message });
    }
  });

  // Response schema for structured Gemini API output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      ringkasan: {
        type: Type.STRING,
        description: "Ringkasan kronologi kasus secara padat, objektif, dan faktual menggunakan bahasa formal Indonesia."
      },
      klasifikasi: {
        type: Type.STRING,
        description: "Klasifikasi hukum yang tepat (Contoh: Hukum Pidana - Penipuan, Hukum Perdata - Perbuatan Melawan Hukum (PMH))"
      },
      pasalTerkait: {
        type: Type.ARRAY,
        description: "Daftar pasal perundang-undangan Indonesia yang relevan dengan kasus tersebut.",
        items: {
          type: Type.OBJECT,
          properties: {
            undangUndang: {
              type: Type.STRING,
              description: "Nama Undang-Undang atau Peraturan secara lengkap (contoh: Kitab Undang-Undang Hukum Pidana (KUHP))"
            },
            pasal: {
              type: Type.STRING,
              description: "Nomor pasal dan ayat yang relevan (contoh: Pasal 378 atau Pasal 1365)"
            },
            isiPasal: {
              type: Type.STRING,
              description: "Penjelasan substansi atau isi pasal tersebut dalam bahasa Indonesia secara ringkas (hindari mengutip kata-per-kata secara eksak untuk menghindari sensor)."
            },
            alasanPemilihan: {
              type: Type.STRING,
              description: "Alasan mengapa pasal ini sangat relevan untuk mengadili kasus ini berdasarkan fakta kronologi."
            }
          },
          required: ["undangUndang", "pasal", "isiPasal", "alasanPemilihan"]
        }
      },
      analisisUnsur: {
        type: Type.ARRAY,
        description: "Pecah unsur-unsur hukum dari pasal utama yang dilanggar secara mendetail.",
        items: {
          type: Type.OBJECT,
          properties: {
            unsur: {
              type: Type.STRING,
              description: "Kutipan klausa atau unsur dari pasal utama tersebut (contoh: 'Barang siapa' atau 'Dengan maksud menguntungkan diri sendiri secara melawan hukum')"
            },
            terpenuhi: {
              type: Type.BOOLEAN,
              description: "Apakah unsur ini terpenuhi oleh tindakan atau kondisi dalam kasus yang diberikan?"
            },
            analisisFakta: {
              type: Type.STRING,
              description: "Penjelasan terperinci dan logis yang mengaitkan teks kronologi kasus dengan pemenuhan unsur hukum ini."
            }
          },
          required: ["unsur", "terpenuhi", "analisisFakta"]
        }
      },
      pertimbanganHukum: {
        type: Type.ARRAY,
        description: "Faktor-faktor pertimbangan hukum lain (posisi alat bukti, potensi daluwarsa, yurisprudensi relevan) dalam bahasa Indonesia.",
        items: {
          type: Type.STRING
        }
      },
      potensiSanksi: {
        type: Type.STRING,
        description: "Rincian ancaman pidana atau pertanggungjawaban perdata (contoh: Penjara maksimal 4 tahun, atau denda materiil ganti rugi)"
      },
      kesimpulan: {
        type: Type.STRING,
        description: "Konklusi akhir menyeluruh meliputi prospek kasus, dan rekomendasi praktis langkah hukum berikutnya."
      },
      confidenceScore: {
        type: Type.INTEGER,
        description: "Tingkat keyakinan analisis hukum ini dalam skala persentasi (0-100)"
      }
    },
    required: [
      "ringkasan",
      "klasifikasi",
      "pasalTerkait",
      "analisisUnsur",
      "pertimbanganHukum",
      "potensiSanksi",
      "kesimpulan",
      "confidenceScore"
    ]
  };

  // Perform Gemini analysis
  app.post("/api/analyze", async (req, res) => {
    // Validate request body using Zod
    const parseResult = analyzeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues.map((e) => e.message).join(" ")
      });
    }

    const { title, chronology, category, evidence } = parseResult.data;

    // Fallback if key is missing or mock is intended
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "") {
      console.warn("GEMINI_API_KEY is missing. Falling back to robust simulated reasoning.");
      const simulatedResult = generateSimulatedReasoning(title, chronology, category, evidence || undefined);
      
      try {
        const newCase = await prisma.case.create({
          data: {
            userId: DEFAULT_USER_ID,
            title,
            chronology,
            category,
            evidence: evidence || "",
            result: simulatedResult as any,
            isBookmarked: false
          }
        });

        await prisma.history.create({
          data: {
            caseId: newCase.id,
            userId: DEFAULT_USER_ID,
            action: "created"
          }
        });

        return res.json({
          ...newCase,
          isDemo: true,
          warning: "Menggunakan mesin penalaran LexAI versi luring (offline) berstandar tinggi karena kunci API Gemini belum tersemat."
        });
      } catch (err: any) {
        console.error("Failed to save offline case:", err);
        return res.status(500).json({ error: "Gagal menyimpan kasus offline: " + err.message });
      }
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const systemPrompt = `Anda adalah LexAI, sistem penalaran hukum (Legal Reasoning System) kecerdasan buatan elit yang didesain secara khusus untuk menganalisis hukum dan peraturan perundang-undangan di Republik Indonesia.
Tugas Anda mendampingi praktisi, mahasiswa, mau pun masyarakat awam dalam membedah kronologis, mencari dalil regulasi, memeriksa pemenuhan unsur undang-undang, serta memberikan proyeksi sanksi secara presisi berdasarkan tata hukum tertulis Indonesia.

Berikan analisis yang sangat taktis, formal, bebas dari basa-basi, menggunakan bahasa Indonesia hukum baku (formal legalese). Responlah HANYA dalam bentuk objek JSON valid sesuai skema tanggapan tanpa membubuhkan markup markdown lain (seperti \`\`\`json) atau teks pengantar apapun.`;

      const userTextPrompt = `Silakan lakukan analisis penalaran hukum mendalam terhadap kasus berikut ini:
Judul Kasus: ${title}
Kategori Kasus: ${category}
Bukti Pendukung: ${evidence || "Tidak ada bukti tertulis tertuju"}
Kronologi Kejadian:
${chronology}

Instruksi Analisis:
1. Ringkas kronologi ke bentuk fakta hukum penting yang terstruktur.
2. Klasifikasikan jenis pelanggaran secara jelas di hukum perundang-undangan Indonesia (e.g. Buku II KUHP, UU ITE, KUHPerdata, UU Ketenagakerjaan).
3. Identifikasi minimal 1 sampai 3 pasal terkait yang paling kuat menjerat atau melindungi pihak berwenang. Jelaskan isi/substansi pasal tersebut menggunakan bahasa Anda sendiri (hindari kutipan verbatim/kata-per-kata secara eksak untuk menghindari sensor hak cipta/recitation) beserta alasan kuat mengapa pasal itu dicantumkan.
4. Lakukan Analisis Unsur Hukum dari PASAL UTAMA yang dilanggar. Pecah pasal tersebut menjadi unsur-unsur pembentuknya, lalu tentukan apakah 'terpenuhi' (true) or tidak (false) berdasarkan rincian kronologi, lengkap dengan penjelasan analisanya yang logis.
5. Sediakan Pertimbangan Hukum tambahan seperti kelengkapan alat bukti (berdasarkan Pasal 184 KUHAP untuk pidana atau pembuktian perdata), daluwarsa tuntutan, atau yurisprudensi yang relevan.
6. Sebutkan Potensi Sanksi hukuman pidana kurungan, denda rupiah, ganti rugi, atau sanksi administratif secara spesifik.
7. Rumuskan Kesimpulan akhir berupa konklusi hukum yang padat serta rekomendasi saran langkah hukum praktis bagi pengguna.
8. Berikan Nilai Keyakinan Analisis (Confidence Score) antara 0-100 persen berdasarkan kekuatan fakta hukum dan kelengkapan bukti.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userTextPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: responseSchema as any,
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Tanggapan dari Gemini kosong.");
      }

      const analyticResult = JSON.parse(responseText.trim());

      const newCase = await prisma.case.create({
        data: {
          userId: DEFAULT_USER_ID,
          title,
          chronology,
          category,
          evidence: evidence || "",
          result: analyticResult,
          isBookmarked: false
        }
      });

      await prisma.history.create({
        data: {
          caseId: newCase.id,
          userId: DEFAULT_USER_ID,
          action: "created"
        }
      });

      res.json(newCase);

    } catch (err: any) {
      console.error("Gemini analysis failed:", err);
      res.status(500).json({
        error: "Gagal memproses analisis hukum AI: " + err.message,
        details: err
      });
    }
  });

  // Create demo case endpoint
  app.post("/api/create-demo-case", async (req, res) => {
    try {
      const demoCaseId = "case_demo1";
      
      const existing = await prisma.case.findFirst({
        where: { id: demoCaseId }
      });
      if (existing) {
        return res.json(existing);
      }

      const chronology = `Saya diajak bergabung dalam investasi pengadaan sarana IT kelurahan oleh seseorang bernama Rian (nama samaran/akun telegram medsos). Ia menjanjikan pembagian keuntungan tetap sebesar 20% setiap bulan dari modal yang disetorkan. Karena tertarik, saya mentransfer uang sebesar Rp150.000.000 ke rekening Rian secara dua tahap pada awal Februari 2026. Rian memberikan surat perjanjian kerja sama dengan kop surat fiktif Pemerintah Provinsi DKI Jakarta lengkap dengan stempel palsu yang meyakinkan. Setelah jatuh tempo pengembalian keuntungan pertama di bulan Maret, Rian sangat sulit dihubungi, nomor WhatsApp saya diblokir, dan ketika saya mengecek ke kantor kelurahan terkait, pengadaan IT tersebut dinyatakan sama sekali tidak ada. Kerugian yang saya alami mencapai 150 juta rupiah penuh tanpa ada pengembalian sepeser pun.`;

      const demoCaseResult = {
        ringkasan: "Kasus dugaan penipuan online bermodus penawaran kerja sama investasi fiktif pengadaan sarana IT kelurahan, di mana pelaku mengajak korban menyetor dana Rp 150.000.000 via Telegram dengan jaminan palsu berupa perjanjian berstempel Pemprov DKI Jakarta buatan, namun pelaku melarikan diri pasca kapital terkumpul.",
        klasifikasi: "Hukum Pidana - Penipuan Online (Pasal 28 Undang-Undang ITE jo. Pasal 378 KUHP)",
        pasalTerkait: [
          {
            undangUndang: "Kitab Undang-Undang Hukum Pidana (KUHP)",
            pasal: "Pasal 378",
            isiPasal: "Barang siapa dengan maksud untuk menguntungkan diri sendiri atau orang lain secara melawan hukum, dengan memakai nama palsu atau martabat palsu, dengan tipu muslihat, ataupun rangkaian kebohongan, menggerakkan orang lain untuk menyerahkan barang sesuatu kepadanya, diancam karena penipuan, dengan pidana penjara paling lama empat tahun.",
            alasanPemilihan: "Tindakan menggunakan kontrak proyek kelurahan palsu dan stempel Pemprov DKI fiktif merupakan perwujudan nyata dari 'tipu muslihat' dan 'rangkaian kebohongan' untuk menggerakkan korban menyerahkan uang."
          },
          {
            undangUndang: "UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE",
            pasal: "Pasal 28 ayat (1)",
            isiPasal: "Setiap Orang dengan sengaja dan tanpa hak menyebarkan Berita Bohong dan Menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.",
            alasanPemilihan: "Skenario penawaran dan pembagian keuntungan disebarkan pelaku melalui medium elektronik (Telegram & WhatsApp), mensyaratkan berlakunya pemidanaan khusus UU ITE karena terjadi kerugian konsumen elektronik."
          }
        ],
        analisisUnsur: [
          {
            unsur: "Unsur 'Secara Melawan Hukum' pidana materiil",
            terpenuhi: true,
            analisisFakta: "Pelaku menawarkan pengadaan proyek fiktif kelurahan yang sebenarnya tidak ada. Membujuk, membuat stempel palsu, dan menguasai uang 150 juta rupiah secara melawan hukum demi kepentingan memperkaya diri sendiri."
          },
          {
            unsur: "Unsur 'Menyebarkan informasi bohong yang mengakibatkan kerugian konsumen'",
            terpenuhi: true,
            analisisFakta: "Pelaku memalsukan dokumen penawaran pengadaan IT kelurahan secara elektronik ke korban, menggiurkan keuntungan 20% yang berakhir pada nihilnya pengembalian modal korban yang merugi Rp150 Juta."
          },
          {
            unsur: "Unsur penggunaan alat penipu (Martabat palsu atau rangkaian kebohongan)",
            terpenuhi: true,
            analisisFakta: "Penggunaan kop surat palsu Pemprov DKI Jakarta dan stempel fiktif kelurahan adalah representasi tipu muslihat yang dirancang sedemikian rupa untuk melumpuhkan akal sehat korban agar mau menyerahkan dana."
          }
        ],
        pertimbanganHukum: [
          "Berdasarkan Pasal 184 KUHAP, bukti transfer digital dan screenshot chat Telegram dapat dijadikan alat bukti petunjuk yang kuat, sekaligus bukti elektronik sah sesuai Pasal 5 UU ITE.",
          "Pemalsuan stempel dan kop surat Pemprov DKI Jakarta juga terindikasi kuat melanggar Pasal 263 KUHP terkait Pemalsuan Surat (ancaman pidana hingga 6 tahun), yang dapat memperberat hukuman pelaku."
        ],
        potensiSanksi: "Pelaku dapat dijerat hukuman kumulatif atau alternatif: Pidana penjara paling lama 6 (enam) tahun dan denda maksimal Rp 1.000.000.000 (Pasal 45A UU ITE) serta tambahan hukuman pidana Pasal 263 KUHP Pemalsuan Surat.",
        kesimpulan: "Kasus ini memiliki pembuktian hukum yang sangat kuat (>90% keberhasilan). Rekomendasi langkah taktis: 1) Segera ajukan pemblokiran rekening terlapor ke Bank BCA pengirim dan bank penerima dengan menyerahkan Laporan Kejadian sementara; 2) Datangi SPKT Polres Metro setempat untuk melayangkan Laporan Pidana atas dugaan penipuan UU ITE dan pemalsuan dokumen.",
        confidenceScore: 92
      };

      const demoCase = await prisma.case.create({
        data: {
          id: demoCaseId,
          userId: DEFAULT_USER_ID,
          title: "Penipuan Investasi Pengadaan Alat IT Kelurahan Palsu",
          chronology,
          category: "Pidana - Transaksi Elektronik & Penipuan",
          evidence: "Tangkapan layar chat Telegram, Bukti transfer Bank BCA Rp 150 Juta, Surat Perjanjian dengan Kop Surat palsu bermaterai",
          result: demoCaseResult,
          isBookmarked: true
        }
      });

      await prisma.history.create({
        data: {
          caseId: demoCaseId,
          userId: DEFAULT_USER_ID,
          action: "created"
        }
      });

      res.json(demoCase);
    } catch (err: any) {
      console.error("Error creating demo case:", err);
      res.status(500).json({ error: "Gagal membuat kasus demo: " + err.message });
    }
  });

  // Simulated reasoning engine for offline demo mode
  function generateSimulatedReasoning(title: string, chronology: string, category: string, evidence?: string) {
    const textLower = (chronology + " " + title).toLowerCase();
    
    let klasifikasi = "Hukum Pidana - Kasus Umum";
    let pasalTerkait = [
      {
        undangUndang: "Kitab Undang-Undang Hukum Pidana (KUHP)",
        pasal: "Pasal 378",
        isiPasal: "Barang siapa dengan maksud untuk menguntungkan diri sendiri atau orang lain secara melawan hukum, dengan memakai nama palsu atau martabat palsu, dengan tipu muslihat, ataupun rangkaian kebohongan, menggerakkan orang lain untuk menyerahkan barang sesuatu kepadanya, atau supaya memberi hutang maupun menghapuskan piutang, diancam karena penipuan, dengan pidana penjara paling lama empat tahun.",
        alasanPemilihan: "Kronologi menunjukkan adanya unsur bujuk rayu, janji manis, atau dugaan rangkaian kata-kata bohong dari pelaku untuk memperoleh uang atau objek material korban."
      }
    ];

    let analisisUnsur = [
      {
        unsur: "Barang siapa (Subjek Hukum)",
        terpenuhi: true,
        analisisFakta: "Tindakan dilakukan secara sadar oleh oknum pelaku terlapor yang memiliki kecakapan pertanggungjawaban hukum."
      },
      {
        unsur: "Dengan maksud menguntungkan diri sendiri atau orang lain secara melawan hukum",
        terpenuhi: true,
        analisisFakta: "Terdapat perolehan manfaat finansial sepihak dari korban oleh terlapor yang bertentangan dengan kebenaran hakiki."
      },
      {
        unsur: "Memakai nama, martabat palsu, tipu muslihat, atau rangkaian kebohongan",
        terpenuhi: true,
        analisisFakta: "Pelaku menyampaikan kebohongan demi kebohongan verbal demi menggerakkan korban menyerahkan kekayaan pribadi."
      }
    ];

    let pertimbanganHukum = [
      "Kelengkapan dokumen awal berupa tangkapan layar (screenshot) obrolan, nomor kontak, serta kuitansi pembayaran/mutasi wajib didokumentasikan.",
      "Sesuai Pasal 184 KUHAP, bukti transfer digital berpotensi kuat sebagai Alat Bukti Petunjuk jika dikorelasikan kesaksian saksi korban."
    ];

    let potensiSanksi = "Pidana penjara paling lama 4 (empat) tahun berdasarkan Pasal 378 KUHP (Penipuan Konvensional).";
    let kesimpulan = "Berdasarkan bedah fakta hukum awal, terdapat indikasi tindak penipuan yang sangat kuat. Sebaiknya segera kirimkan Somasi Teguran Hukum 1 hingga 2 kali. Jika tidak dipenuhi, korban berhak mengadukan ke Kepolisian Sektor atau Kepolisian Resor setempat atas dasar tindak pidana.";
    let confidenceScore = 80;

    if (category.toLowerCase().includes("ite") || category.toLowerCase().includes("elektronik") || textLower.includes("online") || textLower.includes("wa") || textLower.includes("chat") || textLower.includes("website") || textLower.includes("sosmed")) {
      klasifikasi = "Hukum Pidana - Penipuan Transaksi Elektronik";
      pasalTerkait = [
        {
          undangUndang: "UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE",
          pasal: "Pasal 28 ayat (1)",
          isiPasal: "Setiap Orang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.",
          alasanPemilihan: "Tindakan menyebarkan informasi bohong di media sosial, WhatsApp, atau media elektronik sejenis yang bertransaksi secara digital menimbulkan kerugian konsumen finasial."
        }
      ];
      analisisUnsur = [
        {
          unsur: "Setiap Orang (Subjek Hukum Perorangan)",
          terpenuhi: true,
          analisisFakta: "Terlapor merupakan pengguna sistem elektronik aktif yang melancarkan propaganda penawaran fiktif."
        },
        {
          unsur: "Sengaja dan tanpa hak menyebarkan berita bohong/menyesatkan",
          terpenuhi: true,
          analisisFakta: "Pelaku menawarkan barang atau peluang komersial yang sebenarnya tidak kunjung ada secara sengaja via internet."
        },
        {
          unsur: "Mengakibatkan kerugian konsumen dalam Transaksi Elektronik",
          terpenuhi: true,
          analisisFakta: "Korban telah melakukan pembayaran transfer digital tetapi barang tidak dikirim ke alamat, merampas hak konsumen bermaterial besar."
        }
      ];
      pertimbanganHukum = [
        "Status hukum bukti transfer digital sangat valid berdasarkan Pasal 5 UU ITE sebagai perluasan alat bukti pengadilan yang absah.",
        "Dapat dirangkap dengan Pasal 378 KUHP untuk memperluas jangkauan pembuktian di pengadilan jika unsur transaksi elektronik diperdebatkan."
      ];
      potensiSanksi = "Pidana penjara maksimal 6 (enam) tahun dan/atau sanksi denda material sebesar maksimal Rp 1.000.000.000 (satu miliar rupiah) berdasarkan Pasal 45A UU ITE.";
      kesimpulan = "Sangat terbukti memenuhi prasyarat dakwaan Pasal 28 ayat (1) UU ITE. Rekomendasi taktis: Segera cetak bukti obrolan digital, catat nomor rekening pelaku, minta pihak bank menangguhkan aktivitas rekening pelaku, lalu buat Laporan Polisi ke Tim Cyber Crime Polda/Polres setempat.";
      confidenceScore = 88;
    } else if (category.toLowerCase().includes("perdata") || category.toLowerCase().includes("bisnis") || textLower.includes("kontrak") || textLower.includes("janji") || textLower.includes("perjanjian") || textLower.includes("utang")) {
      klasifikasi = "Hukum Perdata - Wanprestasi Terhadap Perikatan Bersama";
      pasalTerkait = [
        {
          undangUndang: "Kitab Undang-Undang Hukum Perdata (KUHPerdata)",
          pasal: "Pasal 1243",
          isiPasal: "Penggantian biaya, kerugian dan bunga karena tak dipenuhinya suatu perikatan mulai diwajibkan, bila debitur, walaupun telah dinyatakan lalai, tetap lalai untuk memenuhi perikatan itu, atau jika sesuatu yang harus diberikan atau dilakukannya hanya dapat diberikan atau dilakukannya dalam waktu yang melampaui waktu yang telah ditentukan.",
          alasanPemilihan: "Terdapat perjanjian/kontrak resmi di mana debitur cidera janji (wanprestasi) tidak membayarkan cicilan, melunasi utang, atau mengerjakan proyek sesuai kesepakatan tenggat waktu."
        }
      ];
      analisisUnsur = [
        {
          unsur: "Adanya perikatan hukum yang sah (Pasal 1320 KUHPerdata)",
          terpenuhi: true,
          analisisFakta: "Para pihak telah meneken surat perjanjian atau mufakat lisan yang sah yang mengikat kedua belah pihak layaknya undang-undang (Pasal 1338 KUHPerdata)."
        },
        {
          unsur: "Kondisi Kelalaian (dipertegas melalui Somasi)",
          terpenuhi: textLower.includes("somasi") || textLower.includes("tegur") || textLower.includes("tagih"),
          analisisFakta: textLower.includes("somasi") || textLower.includes("tegur") || textLower.includes("tagih")
            ? "Kreditur telah mengirimkan tagihan serta somasi teguran resmi namun debitur terus mangkir dari kewajiban."
            : "Saat ini diperlukan penyusunan surat Somasi resmi untuk memberikan ketetapan lalai secara yuridis formal."
        },
        {
          unsur: "Debitur tidak dipenuhi kewajiban/prestasinya",
          terpenuhi: true,
          analisisFakta: "Prestasi penyelesaian pekerjaan atau bayaran yang dituntut tetap terabaikan atau terlewat batas tenggang kesepakatan."
        }
      ];
      pertimbanganHukum = [
        "Keabsahan perjanjian sangat terjamin berkat pembuktian tertulis (Pasal 1867 KUHPerdata) yang bernilai kekuatan pembuktian mutlak.",
        "Perlu diverifikasi klausul 'Penyelesaian Sengketa' (Arbitrase/Pengadilan Negeri) di dalam naskah perjanjian."
      ];
      potensiSanksi = "Kewajiban mengembalikan pokok hutang ditambah denda keterlambatan (ganti rugi perdata) beserta bunga terakumulasi dan menanggung biaya perkara.";
      kesimpulan = "Tindakan terlapor memenuhi kualifikasi Wanprestasi menurut Pasal 1243 KUHPerdata. Layangkan surat Somasi Peringatan Hukum sebanyak 3 kali berturut-turut. Apabila diabaikan, lanjutkan dengan pendaftaran Gugatan Sederhana (Small Claim Court) atau Gugatan Perdata biasa ke Pengadilan Negeri daerah hukum tergugat.";
      confidenceScore = 85;
    } else if (category.toLowerCase().includes("kerja") || textLower.includes("gaji") || textLower.includes("pekerja") || textLower.includes("phk") || textLower.includes("karyawan")) {
      klasifikasi = "Hukum Hubungan Industrial & Ketenagakerjaan";
      pasalTerkait = [
        {
          undangUndang: "UU No. 13 Tahun 2003 tentang Ketenagakerjaan jo. UU No. 6 Tahun 2023 (UU Cipta Kerja)",
          pasal: "Pasal 156 ayat (1)",
          isiPasal: "Dalam hal terjadi pemutusan hubungan kerja, pengusaha diwajibkan membayar uang pesangon dan atau uang penghargaan masa kerja dan uang penggantian hak yang seharusnya diterima.",
          alasanPemilihan: "Tindakan pemecatan sepihak (PHK sepihak) atau penangguhan hak-hak finansial pekerja oleh pengusaha tanpa kompensasi komprehensif."
        }
      ];
      analisisUnsur = [
        {
          unsur: "Adanya hubungan kerja yuridis antara pengusaha dengan pekerja",
          terpenuhi: true,
          analisisFakta: "Kredit hubungan didukung dengan perjanjian kerja (PKWT/PKWTT) serta riwayat penerimaan upah bulanan terlampir."
        },
        {
          unsur: "Telah terjadi pembubaran hubungan kerja (PHK)",
          terpenuhi: true,
          analisisFakta: "Pekerja dicegah beraktivitas kerja secara sepihak atau diberhentikan mendadak tanpa surat peringatan memadai."
        },
        {
          unsur: "Kelalaian penunaian kewajiban hak kompensasi (pesangon/UPMK/UPH) sesuai rumus undang-undang",
          terpenuhi: true,
          analisisFakta: "Manajemen perusahaan menolak membayar pesangon yang setara dengan durasi masa pengabdian pekerja."
        }
      ];
      pertimbanganHukum = [
        "Tahapan penyelesaian wajib dimulai dari perundingan Bipartit (kekeluargaan). Hasil perundingan dituangkan dalam Perjanjian Bersama (PB).",
        "Salinan slip gaji, mutasi rekening bank bukti pekerjaan, surat penugasan, dan surat pemutusan kontrak memegang peran vital bukti otentik PHI."
      ];
      potensiSanksi = "Kewajiban melunasi pesangon penuh, uang penggantian hak, ditambah pembayaran upah proses (back pay) selama sengketa berlangsung.";
      kesimpulan = "Kasus ini berpotensi kuat memenangkan hak pekerja di mata hukum. Kirimkan surat permintaan resmi perundingan Bipartit I dalam 14 hari kerja. Jika buntu, segera daftarkan Perselisihan Hubungan Industrial ke Suku Dinas Tenaga Kerja domisili perusahaan.";
      confidenceScore = 82;
    }

    return {
      ringkasan: `Ringkasan Analisis Fakta: ${title}. Kasus yang dilaporkan menyoroti dugaan pelanggaran komparatif atas hak pihak pelapor yang mengalami diskriminasi finansial atau penyalahgunaan kesepakatan oleh pihak terlapor dalam rentang kronologis tertera.`,
      klasifikasi,
      pasalTerkait,
      analisisUnsur,
      pertimbanganHukum,
      potensiSanksi,
      kesimpulan,
      confidenceScore
    };
  }

  // Vite development or production assets serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LexAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
