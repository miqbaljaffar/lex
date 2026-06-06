import React from "react";
import { 
  Gavel, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  TrendingUp, 
  Scale, 
  Clock,
  BookOpen
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  caseCount: number;
}

export default function LandingPage({ onStart, caseCount }: LandingPageProps) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const stats = [
    { label: "Rata-rata Durasi Analisis", value: "~2 Detik", icon: Clock, desc: "Dibandingkan berminggu-minggu riset manual" },
    { label: "Akurasi Klasifikasi Yuridis", value: "94.8%", icon: Scale, desc: "Akurasi kesesuaian draf pasal" },
    { label: "Regulasi Terintegrasi", value: "1,500+", icon: BookOpen, desc: "KUHP, UU ITE, KUHPerdata, UU Ketenagakerjaan" },
    { label: "Analisis Saya", value: `${caseCount} Kasus`, icon: FileText, desc: "Disimpan aman di basis data lokal" },
  ];

  const workflow = [
    { 
      step: "01",
      title: "Input Kronologi Kejadian", 
      desc: "Masukkan rincian kronologi kasus, tanggal, kronologis tertulis, serta bukti relevan secara santai.",
      icon: FileText
    },
    { 
      step: "02",
      title: "Identifikasi & Klasifikasi", 
      desc: "AI menyaring fakta kunci kasus, memilah klasifikasi pelanggaran baik hukum pidana, perdata, maupun korporat.",
      icon: Cpu
    },
    { 
      step: "03",
      title: "Pecah Unsur & Regulasi", 
      desc: "Sistem mencocokkan fakta dengan pasal perundang-undangan (undang-undang utama) Indonesia, memeriksa pemenuhan unsur.",
      icon: Gavel
    },
    { 
      step: "04",
      title: "Resolusi & Pertimbangan", 
      desc: "Menerima berkas laporan penalaran hukum lengkap dengan kesimpulan, potensi sanksi, dan anjuran langkah taktis pengadilan.",
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      q: "Apa itu LexAI dan bagaimana cara kerjanya?",
      a: "LexAI adalah AI Legal Reasoning System yang memanfaatkan teknologi pemrosesan bahasa alami (NLP) tercanggih untuk mengekstrak fakta-fakta hukum dari kronologi peristiwa yang Anda ketikkan. Sistem ini mencocokkan fakta tersebut dengan database peraturan undang-undang Republik Indonesia (seperti KUHP, KUHPerdata, UU ITE, UU Cipta Kerja), membedah pemenuhan unsur-unsur pasal demi pasal, memberikan pertimbangan hukum, dan menghasilkan rekomendasi."
    },
    {
      q: "Apakah hasil analisis LexAI dapat dijadikan bukti hukum resmi?",
      a: "Tidak. LexAI dirancang murni sebagai alat bantu edukasi hukum dan penalaran awal (second opinion) untuk membantu praktisi hukum, mahasiswa hukum, atau masyarakat awam memahami konstruksi perkara mereka. Hasil analisis ini tidak bersifat mengikat dan tidak menggantikan nasihat hukum formal dari Advokat, Pengacara, atau Konsultan Hukum berlisensi resmi."
    },
    {
      q: "Bagaimana LexAI melindungi kerahasiaan kronologi kasus saya?",
      a: "Data kronologi, judul kasus, bukti, dan riwayat penalaran Anda disimpan secara aman secara lokal di server sandbox Anda. Tidak ada data yang dibagikan kepada pihak ketiga di luar API pemrosesan bahasa AI terenkripsi. Anda juga berhak menghapus seluruh riwayat analisis kapan saja secara permanen."
    },
    {
      q: "Undang-undang atau kategori hukum apa saja yang dicakup saat ini?",
      a: "Saat ini LexAI sangat kuat menganalisis rumpun Hukum Pidana Umum (KUHP), Hukum Siber / Dokumen Elektronik (UU ITE), Hukum Perdata Umum (KUHPerdata seperti Wanprestasi & Perbuatan Melawan Hukum), dan Hukum Ketenagakerjaan (Kompensasi PHK & Hak Pekerja)."
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-4xl mx-auto space-y-8 px-4" id="hero-section">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium tracking-wide">
          <Gavel className="w-3.5 h-3.5" />
          <span>Indonesian AI Legal Reasoning Technology</span>
        </div>
        
        <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight text-slate-100 leading-[1.1]">
          Sistem <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">Penalaran Hukum AI</span> Untuk Regulasi Indonesia
        </h1>
        
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Kupas tuntas kronologi sengketa Anda secara cerdas. Identifikasi jeratan pasal, bedah pemenuhan unsur hukum pidana/perdata, perkirakan sanksi, dan susun rekomendasi aksi dalam hitungan detik.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            id="start-analysis-btn"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <span>Mulai Analisis Kasus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <a 
            href="#cara-kerja"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors flex items-center justify-center"
          >
            Pelajari Cara Kerja
          </a>
        </div>
      </section>

      {/* 2. Stats Bento Grid */}
      <section className="px-4" id="stats-section">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="glass-panel p-6 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 font-medium tracking-wider">{stat.label}</span>
                  <div className="p-2 bg-slate-900 rounded-lg text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="font-display font-medium text-2xl lg:text-3xl text-slate-100 tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 font-light mt-1">{stat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Cara Kerja Section */}
      <section className="pt-8 max-w-6xl mx-auto px-4 space-y-12" id="cara-kerja">
        <div className="text-center space-y-3">
          <h2 className="font-display font-bold text-3xl text-slate-100 tracking-tight">Proses Penalaran Hukum AI</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-light leading-relaxed">
            Dari kronologi perkara lepas hingga laporan taktis analisis hukum formal yang sangat komprehensif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-slate-900 -z-10" />
          
          {workflow.map((flow, i) => {
            const Icon = flow.icon;
            return (
              <div 
                key={i} 
                className="glass-panel p-6 rounded-2xl relative space-y-4 border border-slate-900/60 shadow hover:border-slate-800 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/10 group-hover:text-indigo-300 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-3xl text-indigo-400 group-hover:text-indigo-700 transition-colors leading-none">{flow.step}</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-base text-slate-200">{flow.title}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{flow.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 space-y-8" id="faq-section">
        <div className="text-center space-y-3">
          <Gavel className="w-8 h-8 text-indigo-500 mx-auto" />
          <h2 className="font-display font-bold text-3xl text-slate-100 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-slate-400 text-sm font-light">Pelajari regulasi pengoperasian LexAI di Indonesia.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i}
                className="glass-panel rounded-xl overflow-hidden border border-slate-900 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-medium text-slate-200 hover:text-slate-100 transition-colors"
                >
                  <span className="text-sm md:text-base font-display">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs md:text-sm text-slate-400 font-light leading-relaxed border-t border-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Clean Professional CTA footer */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="glass-panel-neon p-8 md:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl -z-10" />
          
          <Scale className="w-12 h-12 text-indigo-400 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-100 tracking-tight">Siap Melakukan Penalaran Hukum?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto font-light leading-relaxed">
              Bergabunglah dengan pengacara, akademisi, dan publik dalam menyingkap keadilan hukum secara modern.
            </p>
          </div>

          <button
            onClick={onStart}
            className="px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Buka Dashboard Analisis</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>
    </div>
  );
}
