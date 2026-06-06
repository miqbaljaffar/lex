import React from "react";
import { 
  Building2, 
  HelpCircle, 
  Gavel, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Scale, 
  ArrowUpRight 
} from "lucide-react";

export default function HelpCenter() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const stats = [
    { name: "KUHP", desc: "Kitab Undang-Undang Hukum Pidana", clauses: "Pidana umum (Penipuan, Penggelapan, Pemalsuan)" },
    { name: "KUHPerdata", desc: "Kitab Undang-Undang Hukum Perdata", clauses: "Hukum perjanjian timbal-balik, sengketa wanprestasi" },
    { name: "UU ITE", desc: "Undang-Undang Transaksi Elektronik", clauses: "Pasal 28 (Berita bohong online, kerugian konsumen siber)" },
    { name: "UU Ketenagakerjaan", desc: "UU No. 13/2003 jo. UU Cipta Kerja", clauses: "Sengketa hubungan kerja, PHK unilateral, formula pesangon" }
  ];

  const evidenceRequirements = [
    { title: "Keterangan Saksi (Pasal 184 KUHAP)", detail: "Kesaksian langsung dari orang lain yang melihat, mendengar, atau mengalami peristiwa hukum itu sendiri." },
    { title: "Keterangan Ahli", detail: "Pendapat tertulis atau lisan dari pakar hukum pidana/perdata, forensik digital, atau praktisi tersertifikasi." },
    { title: "Surat / Dokumen Resmi", detail: "Kontrak resmi, akta otentik notaris, sertifikat, atau korespondensi cetak bermeterai sah." },
    { title: "Bukti Petunjuk / Elektronik", detail: "Berdasarkan Pasal 5 UU ITE, tangkapan layar chat WA, rekaman surel, mutasi perbankan elektronik adalah sah hukum." },
    { title: "Keterangan Terdakwa", detail: "Pengakuan atau keterangan langsung terduga terlapor di hadapan persidangan kepolisian." }
  ];

  const legalFaqs = [
    {
      q: "Bagaimana cara kerja formula penalaran LexAI?",
      a: "Sistem menyaring kronologi bebas pengguna, mengekstraksi terminologi kunci, lalu mencocokkannya dengan database regulasi. Selanjutnya, model AI memisahkan kalimat kronologi untuk diuji terhadap elemen mutlak (unsur-unsur pasal) sehingga menghasilkan analisis keabsahan."
    },
    {
      q: "Apakah LexAI menyimpan data keluhan saya secara publik?",
      a: "Tidak. Seluruh interaksi, deskripsi, nama sengketa, dan berkas analisis tersimpan aman dalam berkas sandbox portabel (db.json) lokal milik Anda. Tidak ada data yang dipublikasikan atau digunakan sebagai model pelatihan eksternal."
    },
    {
      q: "Mengapa nilai keyakinan (confidence score) analisis saya rendah?",
      a: "Nilai keyakinan mencerminkan ketersediaan fakta objektif, kejelasan subjek-objek, dan keutuhan alat bukti. Jika kronologi Anda terlalu singkat tanpa rincian nominal atau bukti komunikasi yang solid, skor keyakinan AI akan menyesuaikan secara konservatif."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="help-center-wrapper">
      {/* Page Title */}
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-450" />
          <span>Direktori Informasi Hukum & FAQ</span>
        </h2>
        <p className="text-slate-450 text-sm font-light leading-relaxed">
          Pelajari landasan hukum Republik Indonesia, syarat mutlak pembuktian yuridis formal, serta metode sistem penalaran hukum berbasis kecerdasan buatan.
        </p>
      </div>

      {/* Grid: Kodifikasi statutory & Evidence requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statutory descriptions */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
            <Scale className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display text-sm tracking-wide uppercase">1. Rumpun Legislasi Masuk Sistem</h3>
          </div>

          <div className="space-y-3">
            {stats.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                  <p className="text-[10px] text-slate-500 font-light">{item.desc}</p>
                  <p className="text-[11px] text-slate-400 font-light leading-snug mt-1">{item.clauses}</p>
                </div>
                <Gavel className="w-3.5 h-3.5 text-slate-700 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Evidence standard requirements ( Pasal 184 KUHAP) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display text-sm tracking-wide uppercase">2. Standar Kelayakan Alat Bukti</h3>
          </div>

          <ul className="space-y-3">
            {evidenceRequirements.map((item, idx) => (
              <li 
                key={idx} 
                className="bg-slate-950 p-3 rounded-xl border border-slate-950/60 flex items-start gap-3"
              >
                <div className="text-[9px] font-mono text-indigo-400 bg-slate-900 border border-slate-850 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">{item.title}</span>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-light mt-0.5">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQs blocks */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 font-semibold text-slate-300">
          <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="font-display text-sm uppercase tracking-wide">3. Tanya Jawab Tekno-Hukum</h3>
        </div>

        <div className="space-y-3">
          {legalFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 transition-colors">
                <button 
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left font-display font-medium text-xs md:text-sm text-slate-200 hover:text-indigo-300 flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <span className="text-xs text-slate-500 font-mono">{isOpen ? "[Tutup]" : "[Buka]"}</span>
                </button>
                {isOpen && (
                  <p className="text-[11px] md:text-xs text-slate-400 font-light leading-relaxed mt-2.5 pt-2.5 border-t border-slate-900">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Foot disclaimer warning */}
      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[11px] text-slate-500 font-light leading-normal text-center">
        🎓 <strong>Batas Tanggung Jawab (Disclaimer):</strong> LexAI RI adalah sarana simulasi penalaran logis akademik. Platform tidak menyediakan nasihat hukum advokasi langsung untuk persidangan. Segala sengketa hukum riil harus tetap dikonsultasikan kepada Dewan Pengacara / Advokat berwenang.
      </div>
    </div>
  );
}
