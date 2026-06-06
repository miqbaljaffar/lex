# LexAI

LexAI adalah aplikasi full-stack berbasis React + Vite + Express yang dirancang untuk mengubah narasi kasus hukum menjadi analisis penalaran hukum terstruktur, ringkas, dan praktis.

Aplikasi ini fokus pada konteks hukum Indonesia dan menyediakan fitur untuk:
- Mengumpulkan kronologi kasus beserta bukti pendukung.
- Mengidentifikasi klasifikasi hukum yang relevan.
- Menelusuri pasal dan regulasi yang sesuai.
- Menganalisis unsur-unsur hukum utama.
- Menghasilkan rekomendasi praktis beserta prospek sanksi.

---

## Insight Proyek

LexAI bukan sekadar demo antarmuka: ini adalah prototipe sistem penalaran hukum yang menggabungkan kecerdasan buatan dengan struktur hukum formal.

Beberapa poin insight penting:
- **Analisis Hukum Terperinci**: output dibangun sebagai objek terstruktur yang meliputi ringkasan, klasifikasi, pasal terkait, analisis unsur, pertimbangan hukum, potensi sanksi, kesimpulan, dan skor keyakinan.
- **Dukungan Proses Hukum RI**: model diarahkan untuk menyoroti pasal KUHP, KUHPerdata, UU ITE, UU Ketenagakerjaan, beserta jenis pelanggaran umum di tata hukum Indonesia.
- **Alur Pengguna Realistis**: pengguna dapat membuat kasus baru, mencari kasus lama, menandai bookmark, menghapus, dan melihat riwayat interaksi.
- **Fallback offline**: jika `GEMINI_API_KEY` tidak tersedia, server menyediakan penalaran simulasi yang masih relevan dan terfokus pada dugaan pasal serta rekomendasi hukum.

---

## Fitur Utama

1. **Form Analisis Kasus**
   - Judul kasus.
   - Kategori hukum (Pidana, Perdata, Ketenagakerjaan, UU ITE).
   - Deskripsi kronologi kejadian.
   - Bukti pendukung.

2. **Hasil Analisis Terstruktur**
   - Ringkasan fakta.
   - Klasifikasi pelanggaran.
   - Referensi pasal dengan kutipan, alasan relevansi, dan isi pasal.
   - Analisis pemenuhan unsur hukum secara detail.
   - Pertimbangan hukum pelengkap.
   - Proyeksi sanksi.
   - Confidence score untuk menilai tingkat keyakinan output.

3. **Dashboard Interaktif**
   - Daftar kasus dengan filter pencarian.
   - Tab semua kasus / bookmark.
   - Statistik ringkas seperti total analisis, bookmark, dan kategori teratas.
   - Tombol demo kasus untuk memuat contoh praktis secara instan.

4. **Manajemen Kasus & Riwayat**
   - Penyimpanan lokal menggunakan `db.json`.
   - Endpoint CRUD sederhana di `server.ts`.
   - Riwayat aktivitas berbasis user yang menampilkan tindakan seperti pembuatan dan bookmark.

5. **Pengalaman Hukum Digital**
   - Salin laporan otomatis.
   - Cetak / ekspor ke PDF dari browser.
   - Tampilan hasil yang fokus pada laporan AI Legal Reasoning.

---

## Arsitektur Proyek

- `src/App.tsx` — Pengendali utama navigasi aplikasi, status kasus, dan integrasi endpoint.
- `src/components/AnalysisForm.tsx` — Form pengguna untuk memasukkan data kasus dan mengirimkan analisis.
- `src/components/DashboardMain.tsx` — Panel utama untuk melihat kasus, statistik, pencarian, dan tab bookmark.
- `src/components/AnalysisResultView.tsx` — Tampilan hasil analisis lengkap dengan kemampuan salin dan cetak.
- `src/types.ts` — Tipe data utama seperti `AnalysisCase`, `LegalReasoning`, dan struktur database.
- `server.ts` — Backend Express yang mengelola API, penyimpanan lokal, dan integrasi Gemini API / fallback simulasi.

---

## Teknologi yang Digunakan

- React 19
- Vite 6
- Tailwind CSS 4
- Express 4
- TypeScript
- @google/genai untuk integrasi Gemini API
- Prisma ORM dengan PostgreSQL (Neon) sebagai database utama
- Zod untuk validasi skema request API


---

## Persyaratan

- Node.js
- `GEMINI_API_KEY` bila ingin menggunakan model Gemini asli.

> Jika `GEMINI_API_KEY` belum diset atau bernilai placeholder, sistem akan otomatis menggunakan mode simulasi yang sudah disiapkan dalam `server.ts`.

---

## Menjalankan Proyek

1. Install dependensi:
   ```bash
   pnpm install
   ```
2. Buat file `.env` di root proyek dengan menyalin berkas contoh:
   ```bash
   copy .env.example .env
   ```
   Lalu isi variabel-variabel lingkungan berikut:
   *   `GEMINI_API_KEY`: Kunci API Gemini Anda.
   *   `DATABASE_URL`: URL koneksi PostgreSQL (Neon).

3. Sinkronisasikan skema Prisma ke database Neon:
   ```bash
   npx prisma db push
   ```

4. Jalankan aplikasi:
   ```bash
   pnpm run dev
   ```
5. Buka browser dan akses:
   ```
   http://localhost:3000
   ```

---

## Catatan Pengembangan

- Backend berjalan pada port `3000` dan menggunakan Vite middleware pada mode development.
- Data disimpan pada database PostgreSQL (Neon) melalui Prisma Client, sehingga tidak menggunakan file lokal `db.json` lagi.
- Demo kasus dapat dibuat otomatis melalui endpoint `/api/create-demo-case` untuk memperlihatkan output analisis Hukum Pidana dan ITE.


---

## Kegunaan & Target Pengguna

LexAI cocok untuk:
- mahasiswa hukum yang ingin latihan menyusun analisis hukum.
- pengacara dan paralegal yang butuh kerangka awal penalaran hukum Indonesia.
- pengguna umum yang ingin memahami apakah suatu sengketa memenuhi unsur pelanggaran hukum.

Jumlah insight utama dari proyek ini adalah kemampuan untuk:
- mengkonversi narasi hukum menjadi struktur aturan formal,
- menghubungkan fakta dengan pasal-peraturan,
- menghasilkan rekomendasi hukum yang dapat dirujuk untuk tindak lanjut.

---

## Pengembangan Selanjutnya

Beberapa arah pengembangan berikutnya:
- menambah otentikasi pengguna agar multi-user menyimpan riwayat terpisah.
- menghubungkan ke database yang lebih scalable seperti SQLite atau PostgreSQL.
- memperkaya output dengan yurisprudensi dan referensi putusan.
- menambahkan validasi dan markup hukum lebih lengkap untuk pasal-peraturan Indonesia.

---

## Lisensi

Gunakan dan adaptasi sesuai kebutuhan.

---

Terima kasih telah menggunakan LexAI — solusi prototipe untuk penalaran hukum AI di Indonesia.
