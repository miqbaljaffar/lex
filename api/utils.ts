import fs from "fs/promises";
import path from "path";
import os from "os";
import { GoogleGenAI, Type } from "@google/genai";

const isVercel = process.env.VERCEL === "1";
const repoDbPath = path.join(process.cwd(), "db.json");
const runtimeDbPath = isVercel ? path.join(os.tmpdir(), "lex-db.json") : repoDbPath;

const DEFAULT_DB = { cases: [], history: [] };

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export const DEFAULT_USER_ID = "iqbaljaffar1108@gmail.com";

export async function getDb() {
  try {
    if (!(await pathExists(runtimeDbPath))) {
      if (isVercel && (await pathExists(repoDbPath))) {
        await fs.copyFile(repoDbPath, runtimeDbPath);
      } else {
        await fs.writeFile(runtimeDbPath, JSON.stringify(DEFAULT_DB, null, 2));
        return DEFAULT_DB;
      }
    }

    const raw = await fs.readFile(runtimeDbPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return DEFAULT_DB;
  }
}

export async function saveDb(db: any) {
  try {
    await fs.writeFile(runtimeDbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

export const responseSchema = {
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
            description: "Bunyi kutipan resmi pasal tersebut dalam bahasa Indonesia."
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

export function generateSimulatedReasoning(title: string, chronology: string, category: string, evidence?: string) {
  const textLower = (chronology + " " + title).toLowerCase();

  let klasifikasi = "Hukum Pidana - Kasus Umum";
  let pasalTerkait = [
    {
      undangUndang: "Kitab Undang-Undang Hukum Pidana (KUHP)",
      pasal: "Pasal 378",
      isiPasal: "Barang siapa dengan maksud untuk menguntungkan diri sendiri atau orang lain secara melawan hukum, dengan memakai nama palsu atau martabat palsu, dengan tipu muslihat, ataupun rangkaian kebohongan, menggerakkan orang lain untuk menyerahkan barang sesuatu kepadanya, diancam karena penipuan, dengan pidana penjara paling lama empat tahun.",
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
        isiPasal: "Setiap Orang dengan sengaja dan tanpa hak menyebarkan Berita Bohong dan Menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik.",
        alasanPemilihan: "Skenario penawaran dan pembagian keuntungan disebarkan pelaku melalui medium elektronik (Telegram & WhatsApp), mensyaratkan berlakunya pemidanaan khusus UU ITE karena terjadi kerugian konsumen elektronik."
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
