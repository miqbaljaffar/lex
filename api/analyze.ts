import { getDb, saveDb, DEFAULT_USER_ID, responseSchema, generateSimulatedReasoning } from "./utils.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, chronology, category, evidence } = req.body || {};
  if (!title || !chronology || !category) {
    return res.status(400).json({ error: "Judul, kronologi, dan kategori wajib diisi." });
  }

  const newCaseId = "case_" + Math.random().toString(36).substring(2, 11);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    const simulatedResult = generateSimulatedReasoning(title, chronology, category, evidence);
    const newCase = {
      id: newCaseId,
      userId: DEFAULT_USER_ID,
      title,
      chronology,
      category,
      evidence: evidence || "",
      createdAt: new Date().toISOString(),
      result: simulatedResult,
      isBookmarked: false
    };

    const db = await getDb();
    db.cases.push(newCase);
    db.history.push({
      id: "h_" + Math.random().toString(36).substring(2, 11),
      caseId: newCaseId,
      userId: DEFAULT_USER_ID,
      action: "created",
      timestamp: new Date().toISOString()
    });
    await saveDb(db);

    return res.status(200).json({
      ...newCase,
      isDemo: true,
      warning: "Menggunakan mesin penalaran LexAI versi luring karena kunci API Gemini belum terpasang."
    });
  }

  try {
    // Lazy-import the SDK to avoid initialization-time errors on serverless platforms
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({
      apiKey,
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
4. Lakukan Analisis Unsur Hukum dari PASAL UTAMA yang dilanggar. Pecah pasal tersebut menjadi unsur-unsur pembentuknya, lalu tentukan apakah 'terpenuhi' (true) atau tidak (false) berdasarkan rincian kronologi, lengkap dengan penjelasan analisanya yang logis.
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
        temperature: 0.7
      }
    });

    const responseText = response.text;
    if (!responseText) {
      console.error("Empty response from Gemini. Full response:", JSON.stringify(response));
      throw new Error("Tanggapan dari Gemini kosong. Response: " + JSON.stringify(response));
    }

    const analyticResult = JSON.parse(responseText.trim());
    const newCase = {
      id: newCaseId,
      userId: DEFAULT_USER_ID,
      title,
      chronology,
      category,
      evidence: evidence || "",
      createdAt: new Date().toISOString(),
      result: analyticResult,
      isBookmarked: false
    };

    const db = await getDb();
    db.cases.push(newCase);
    db.history.push({
      id: "h_" + Math.random().toString(36).substring(2, 11),
      caseId: newCaseId,
      userId: DEFAULT_USER_ID,
      action: "created",
      timestamp: new Date().toISOString()
    });
    await saveDb(db);

    return res.status(200).json(newCase);
  } catch (err: any) {
    console.error("Gemini analysis failed:", err);
    return res.status(500).json({ error: "Gagal memproses analisis hukum AI: " + err.message });
  }
}
