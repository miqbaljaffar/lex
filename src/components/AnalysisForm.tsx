import React, { useState, useEffect } from "react";
import { 
  FileText, 
  HelpCircle, 
  AlertCircle, 
  ChevronRight, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Gavel,
  CheckCircle,
  Clock
} from "lucide-react";
import { AnalysisCase } from "../types";

interface AnalysisFormProps {
  onAnalyzeComplete: (analysisCase: AnalysisCase) => void;
}

const CATEGORIES = [
  { id: "Pidana - Penipuan & Kejahatan Finansial", label: "Pidana - Penipuan, Penggelapan, Umum", desc: "KUHP Pasal 378, Pasal 372, dugaan penipuan lisan/tertulis" },
  { id: "Perdata - Sengketa Wanprestasi & Kontrak", label: "Perdata - Wanprestasi & Kelalaian Kontrak", desc: "KUHPerdata Pasal 1243, hutang piutang, sewa menyewa, bisnis" },
  { id: "Ketenagakerjaan - Hak Pekerja & PHK", label: "Ketenagakerjaan - Hak Kerja & Sengketa PHK", desc: "UU Ketenagakerjaan, hak pesangon sepihak, sengketa bipartit" },
  { id: "Pidana - Transaksi Elektronik & UU ITE", label: "Transaksi Elektronik & Siber (UU ITE)", desc: "UU ITE Pasal 28, penipuan online, pencemaran elektronik, medsos" }
];

const PRESETS = [
  {
    title: "Penipuan Tiket Konser Online via Telegram",
    category: "Pidana - Transaksi Elektronik & UU ITE",
    chronology: "Saya melihat postingan penjualan tiket konser coldplay kelas CAT 1 seharga Rp4.500.000 di akun media sosial @konser_jakarta pada 15 Mei 2026. Penjual bernama akun telegram 'Angga_Admin' merayu saya bahwa tiket sisa 1 dan harus ditransfer DP Rp 2.000.000 malam itu juga agar tidak diserahkan orang lain. Saya menyetujui lalu men-transfer DP tersebut ke rekening Bank Danamon nomor 88301980 atas nama ANGGA. Setelah dikirim bukti transfer, penjual memblokir telegram saya, akun instagramnya tiba-tiba menghilang, dan ketika nomor akun itu dilacak ternyata merupakan sindikat penipu luar kota.",
    evidence: "Screenshot obrolan Telegram, Tangkapan layar postingan medsos, Resi transfer bank Danamon Rp2 Juta"
  },
  {
    title: "Gagal Bayar Sewa Ruko & Penundaan Janji Sepihak",
    category: "Perdata - Sengketa Wanprestasi & Kontrak",
    chronology: "Kami sepakat menandatangani kontrak sewa menyewa ruko 3 lantai di Sudirman Jakarta Pusat mulai Juni 2025 s.d Juni 2026 dengan klausul pelunasan sewa Rp50.000.000 di termin kedua pada Desember 2025. Tergugat (penyewa) menyatakan kesulitan kas ekonomi lalu meminta penangguhan pembayaran hingga Maret 2026 secara tertulis. Namun hingga sekarang Mei 2026, tergugat tetap tidak kunjung melunasi termin kedua tersebut, bahkan didapati mengoper sewa ruko tersebut ke pihak ketiga secara ilegal tanpa izin tertulis kami, melanggar klausul Pasal 8 Surat Perjanjian.",
    evidence: "Akte Perjanjian Sewa Notaris, Surat Permohonan Penangguhan Pembayaran, Foto Ruko digunakan pihak ketiga"
  }
];

export default function AnalysisForm({ onAnalyzeComplete }: AnalysisFormProps) {
  const [title, setTitle] = useState("");
  const [chronology, setChronology] = useState("");
  const [evidence, setEvidence] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [err, setErr] = useState("");

  const steps = [
    "Menelaah Fakta Kronologis Kejadian...",
    "Memilah Subjek & Objek Hukum Terlibat...",
    "Mencocokkan dengan Kodifikasi Hukum & Regulasi RI...",
    "Membedah Unsur-Unsur Pasal Utama...",
    "Menyusun Matriks Pertimbangan dan Alat Bukti...",
    "Memformulasikan Berkas Laporan Penalaran LexAI..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setChronology(preset.chronology);
    setEvidence(preset.evidence);
    setErr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chronology.trim()) {
      setErr("Mohon isi judul kasus dan deskripsi kronologi secara lengkap.");
      return;
    }
    setErr("");
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          chronology,
          category,
          evidence
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memproses analisis hukum AI");
      }

      const data = await response.json();
      
      // Delay slightly for dramatic legal-tech compiling effect
      setTimeout(() => {
        setLoading(false);
        onAnalyzeComplete(data);
      }, 1200);

    } catch (err: any) {
      console.error(err);
      setErr(err.message || "Koneksi terganggu. Gagal menganalisis.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="analysis-form-container">
      {loading ? (
        /* Real-time AI compiling state */
        <div className="glass-panel-neon p-12 rounded-3xl text-center space-y-8 min-h-115 flex flex-col items-center justify-center animate-fade-in" id="legal-ai-loader">
          <div className="relative">
            {/* Spinning ring */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-900 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gavel className="w-7 h-7 text-indigo-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <h3 className="font-display font-bold text-xl text-white tracking-tight animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>LexAI Mengompilasi Kasus...</span>
            </h3>
            
            <p className="text-sm text-indigo-200 font-mono font-medium min-h-6">
              {steps[loadingStep]}
            </p>
            
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Mengevaluasi asas hukum, kelayakan alat bukti pendukung, sanksi materil, serta skenario penafsiran hukum Indonesia. Mohon tunggu sesaat.
            </p>
          </div>

          {/* Stepper progress bubbles */}
          <div className="flex items-center space-x-2 pt-4">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < loadingStep 
                    ? "bg-emerald-500" 
                    : i === loadingStep 
                      ? "bg-indigo-500 scale-125" 
                      : "bg-slate-800"
                }`} 
              />
            ))}
          </div>
        </div>
      ) : (
        /* Normal Form Inputs */
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>Ajukan Kasus untuk Analisis AI</span>
            </h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Tulis kronologi perkara Anda. Pilih kategori yang paling presisi, sertakan bukti pendukung jika ada, dan saksikan penyusunan argumen hukum AI secara interaktif.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-950/40 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300">Gunakan Kasus Contoh (Instan)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-200 text-xs font-medium border border-indigo-900/30 hover:border-indigo-500/30 transition-all flex items-center space-x-1"
                >
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              ))}
            </div>
          </div>

          {err && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-900 space-y-6">
            {/* Case Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">
                Judul Perkara / Kasus (Required)
              </label>
              <input
                id="case-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Dugaan Penipuan Kerja Sama Katering Kantor Fiktif"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                required
              />
            </div>

            {/* Case Category Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">
                Kategori Hukum Perkara
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id.replace(/\s+/g, "-")}`}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`
                      text-left p-3.5 rounded-xl border flex flex-col justify-between transition-all
                      ${category === cat.id 
                        ? "bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/5" 
                        : "bg-slate-950/60 border-slate-900 hover:border-slate-800"}
                    `}
                  >
                    <span className={`text-xs font-semibold ${category === cat.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-light mt-1.5 leading-relaxed">
                      {cat.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chronology Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Deskripsi Kronologi Kejadian Lengkap (Required)
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-300" />
                  <div className="hidden group-hover:block absolute right-0 bottom-6 w-64 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-[10px] text-slate-400 font-light leading-relaxed shadow-xl z-20">
                    Sebutkan tanggal transaksi, alibi terduga pelaku pelapor, nominal transfer bank yang dirugi, isi perjanjian khusus, modus operandi pelaku, dan kegagalan kewajiban.
                  </div>
                </div>
              </div>
              <textarea
                id="case-chronology-input"
                rows={8}
                value={chronology}
                onChange={(e) => setChronology(e.target.value)}
                placeholder="Tuliskan runtutan waktu kejadian secara kronologis, siapa saja pihak terduga pelaku, berapa kerugian finansial, dan bentuk janji palsu yang diberikan secara detail..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-y leading-relaxed font-light"
                required
              />
            </div>

            {/* Evidence Inputs */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">
                Alat/Bukti Pendukung Terlampir (Opsional)
              </label>
              <input
                id="case-evidence-input"
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Contoh: Bukti Transfer Rp 15 Juta, Screenshot WA tanggal 10 Feb, Surat Perjanjian ruko"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>

            {/* Legal tips caution panel */}
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-start space-x-3">
              <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-300 block">Kebijakan Kerahasiaan Pengguna</span>
                <p className="text-[10px] text-slate-500 font-light leading-normal">
                  LexAI mematuhi privasi lokal. Data yang diajukan tidak disimpan secara publik di jaringan awan dan diproses secara steril.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-analysis-btn"
                type="submit"
                className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                <span>Mulai Analisis Hukum AI</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
