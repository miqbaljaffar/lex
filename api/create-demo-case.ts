import { getDb, saveDb, DEFAULT_USER_ID } from "./utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = await getDb();
  const demoCaseId = "case_demo1";
  const existing = db.cases.find((item: any) => item.id === demoCaseId && item.userId === DEFAULT_USER_ID);
  if (existing) {
    return res.status(200).json(existing);
  }

  const chronology = `Saya diajak bergabung dalam investasi pengadaan sarana IT kelurahan oleh seseorang bernama Rian (nama samaran/akun telegram medsos). Ia menjanjikan pembagian keuntungan tetap sebesar 20% setiap bulan dari modal yang disetorkan. Karena tertarik, saya mentransfer uang sebesar Rp150.000.000 ke rekening Rian secara dua tahap pada awal Februari 2026. Rian memberikan surat perjanjian kerja sama dengan kop surat fiktif Pemerintah Provinsi DKI Jakarta lengkap dengan stempel palsu yang meyakinkan. Setelah jatuh tempo pengembalian keuntungan pertama di bulan Maret, Rian sangat sulit dihubungi, nomor WhatsApp saya diblokir, dan ketika saya mengecek ke kantor kelurahan terkait, pengadaan IT tersebut dinyatakan sama sekali tidak ada. Kerugian yang saya alami mencapai 150 juta rupiah penuh tanpa ada pengembalian sepeser pun.`;

  const demoCase = {
    id: demoCaseId,
    userId: DEFAULT_USER_ID,
    title: "Penipuan Investasi Pengadaan Alat IT Kelurahan Palsu",
    chronology,
    category: "Pidana - Transaksi Elektronik & Penipuan",
    evidence: "Tangkapan layar chat Telegram, Bukti transfer Bank BCA Rp 150 Juta, Surat Perjanjian dengan Kop Surat palsu bermaterai",
    createdAt: new Date().toISOString(),
    result: {
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
    },
    isBookmarked: true
  };

  db.cases.push(demoCase);
  db.history.push({
    id: "h_demo",
    caseId: demoCaseId,
    userId: DEFAULT_USER_ID,
    action: "created",
    timestamp: new Date().toISOString()
  });
  await saveDb(db);

  return res.status(200).json(demoCase);
}
