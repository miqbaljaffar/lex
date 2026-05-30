import React, { useState } from "react";
import { 
  FileText, 
  Bookmark, 
  Printer, 
  Share2, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  FileCheck, 
  Building2, 
  BookOpen, 
  Flame, 
  Lock, 
  Cpu, 
  RotateCcw,
  Sparkles,
  Clipboard,
  Shield,
  HelpCircle,
  Clock,
  Gavel
} from "lucide-react";
import { AnalysisCase } from "../types";
import ReasoningFlow from "./ReasoningFlow";

interface AnalysisResultViewProps {
  caseData: AnalysisCase;
  onBack: () => void;
  onToggleBookmark: (id: string) => void;
}

export default function AnalysisResultView({ 
  caseData, 
  onBack, 
  onToggleBookmark 
}: AnalysisResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"reasoning" | "evidence" | "legislation">("reasoning");

  const r = caseData.result;
  if (!r) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="font-semibold text-white">Data Penalaran Kosong</h3>
        <p className="text-xs text-slate-400">Terjadi kesalahan. Kasus ini belum diproses penalaran hukum oleh sistem LexAI.</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-900 rounded-lg text-xs text-slate-200">Kembali</button>
      </div>
    );
  }

  // Handle Clipboard Copy
  const handleCopy = () => {
    const textReport = `
=== LAPORAN AI PENALARAN HUKUM - LEXAI ===
Judul Kasus: ${caseData.title}
Kategori Kasus: ${caseData.category}
Tanggal Analisis: ${new Date(caseData.createdAt).toLocaleDateString("id-ID")}
Tingkat Keyakinan AI: ${r.confidenceScore}%

I. RINGKASAN KASUS
${r.ringkasan}

II. KLASIFIKASI PELANGGARAN
${r.klasifikasi}

III. PASAL-PASAL TERKAIT
${r.pasalTerkait.map((p, i) => `
${i + 1}. [${p.pasal} - ${p.undangUndang}]
Kutipan Bunyi: "${p.isiPasal}"
Alasan Relevansi: ${p.alasanPemilihan}
`).join("\n")}

IV. ANALISIS UNSUR HUKUM
${r.analisisUnsur.map((u, i) => `
- Unsur: "${u.unsur}"
  Status: ${u.terpenuhi ? "TERPENUHI" : "TIDAK TERPENUHI"}
  Analisis: ${u.analisisFakta}
`).join("\n")}

V. PERTIMBANGAN HUKUM
${r.pertimbanganHukum.map((p, i) => `[${i + 1}] ${p}`).join("\n")}

VI. POTENSI SANKSI
${r.potensiSanksi}

VII. KESIMPULAN & REKOMENDASI TAKTIS
${r.kesimpulan}

=========================================
Laporan ini disusun secara otomatis oleh Asisten AI Legal Reasoning LexAI RI.
    `;

    navigator.clipboard.writeText(textReport.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Trigger Local Browser Printing
  const handlePrint = () => {
    window.print();
  };

  // Get color boundary for Confidence Level
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 70) return "text-indigo-400 border-indigo-500/20 bg-indigo-500/10";
    return "text-amber-400 border-amber-500/20 bg-amber-500/10";
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in" id="analysis-result-view">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5 no-print">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight truncate max-w-xl">
            {caseData.title}
          </h2>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Dianalisis pada:</span>
            <span className="font-mono">{new Date(caseData.createdAt).toLocaleString("id-ID")}</span>
            <span className="text-slate-800">•</span>
            <span className="text-indigo-400 font-medium">{caseData.category}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(caseData.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
              caseData.isBookmarked 
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30" 
                : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
            }`}
            title="Sematkan Bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${caseData.isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>{caseData.isBookmarked ? "Disimpan" : "Bookmark"}</span>
          </button>

          {/* Copy Report / Share Link */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "Teks Disalin!" : "Salin Laporan"}</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/10 flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Warning banner regarding offline fallback */}
      {(caseData as any).isDemo && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-950/50 rounded-xl text-indigo-300 text-xs no-print flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-bounce" />
          <span>💡 <strong>Analisis Luring Aktif:</strong> { (caseData as any).warning }</span>
        </div>
      )}

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print-only text-center space-y-3 pb-8 border-b border-slate-300">
        <h1 className="font-display font-bold text-2xl text-slate-950">LAPORAN ANALISIS PENALARAN HUKUM AI</h1>
        <p className="text-xs text-slate-600">Disusun secara digital oleh LexAI RI — Asisten Paralegal Kecerdasan Buatan</p>
        <p className="text-xs text-slate-600 font-mono">ID Referensi: {caseData.id} • Tanggal: {new Date(caseData.createdAt).toLocaleString("id-ID")}</p>
      </div>

      {/* METRICS & OVERVIEW ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Summary Card */}
        <div className="lg:col-span-2 glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 print-card">
          <div className="flex items-center space-x-2 mb-4 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display text-sm tracking-wide uppercase">A. Ringkasan Fakta Hukum</h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
            {r.ringkasan}
          </p>
        </div>

        {/* Confidence & Classification Columns */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 flex flex-col justify-between print-card space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
              <Scale className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display text-sm tracking-wide uppercase">B. Klasifikasi Perkara</h3>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 block uppercase">KLASIFIKASI UTAMA</span>
              <p className="text-xs md:text-sm font-semibold text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-850">
                {r.klasifikasi}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 block uppercase">TINGKAT KEYAKINAN AI (H. CONFIDENCE SCORE)</span>
            <div className={`p-4 rounded-xl border flex items-center space-x-4 ${getConfidenceColor(r.confidenceScore)}`}>
              <div className="font-display text-3xl font-extrabold">{r.confidenceScore}%</div>
              <div className="text-[10px] leading-relaxed font-light">
                {r.confidenceScore >= 85 
                  ? "Sangat kuat memenuhi unsur legalitas berdasarkan fakta kronologis tertulis." 
                  : "Cukup mumpuni, direkomendasikan menguatkan bukti digital tambahan."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REASONING VISUALIZATION FLOW */}
      <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 no-print">
        <ReasoningFlow currentStep={5} isCompleted={true} />
      </div>

      {/* CORE WORKSPACE TABS */}
      <div className="grid grid-cols-1 gap-6">
        {/* C. Pasal Terkait (Relevant statutory provisions) */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 print-card space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display text-sm tracking-wide uppercase">C. Rujukan Regulasi Perundang-Undangan Terkait</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {r.pasalTerkait.map((pasal, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950 p-4 rounded-xl border border-slate-900 shadow hover:border-slate-850 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">{pasal.pasal}</span>
                    <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      Rujukan {idx + 1}
                    </span>
                  </div>
                  
                  <span className="text-[11px] font-semibold text-slate-300 block leading-tight">{pasal.undangUndang}</span>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-900 italic text-[11px] text-slate-400 leading-relaxed font-light">
                    &ldquo;{pasal.isiPasal}&rdquo;
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-normal border-t border-slate-900 pt-3">
                  <span className="font-semibold text-indigo-300 block mb-1">Analisis Relevansi:</span>
                  {pasal.alasanPemilihan}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D. Analisis Unsur Hukum (Detailed elements compliance matrix) */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 print-card space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display text-sm tracking-wide uppercase">D. Analisis Unsur Materiil Undang-Undang</h3>
          </div>

          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Pembedahan formulasi pasal utama untuk mengecek apakah unsur-unsur objektif maupun subjektif telah sepenuhnya terpenuhi oleh kronologi kasus:
          </p>

          <div className="space-y-3 pt-2">
            {r.analisisUnsur.map((unsur, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950 p-4 rounded-lg border border-slate-900 hover:border-slate-850 transition-colors grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
              >
                {/* Element Status Badge */}
                <div className="md:col-span-3 flex items-center space-x-2">
                  {unsur.terpenuhi ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Terpenuhi
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Butuh Bukti
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-slate-500">Unsur {idx + 1}</span>
                </div>

                {/* Element Text */}
                <div className="md:col-span-3">
                  <p className="text-xs font-semibold text-slate-300 leading-relaxed font-display">
                    &ldquo;{unsur.unsur}&rdquo;
                  </p>
                </div>

                {/* Factual Analysis */}
                <div className="md:col-span-6 text-xs text-slate-400 leading-relaxed font-light">
                  {unsur.analisisFakta}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E & F. Pertimbangan Hukum & Potensi Sanksi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* E. Pertimbangan Hukum */}
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 print-card space-y-4">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display text-sm tracking-wide uppercase">E. Pertimbangan Hukum Tambahan & Bukti</h3>
            </div>
            
            <ul className="space-y-3">
              {r.pertimbanganHukum.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="text-[10px] font-mono text-indigo-400 bg-slate-950 border border-slate-900 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 leading-normal font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* F. Potensi Sanksi */}
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-slate-900 print-card flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-slate-900 pb-2.5">
                <Lock className="w-4 h-4 text-indigo-400" />
                <h3 className="font-display text-sm tracking-wide uppercase">F. Proyeksi Hukum / Potensi Sanksi</h3>
              </div>
              
              <div className="flex items-start space-x-3.5 bg-amber-500/5 text-amber-400 p-4 rounded-xl border border-amber-500/10">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold block font-display">SANKSI MAKSIMAL Rujukan RI:</span>
                  <p className="text-xs text-amber-300/95 leading-relaxed font-light">
                    {r.potensiSanksi}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed font-light pt-2">
              ⚠️ Proyeksi sanksi merujuk pada pemenuhan dakwaan maksimal legislasi tertulis. Tuntutan sesungguhnya merupakan wewenang absolut Jaksa Penuntut Umum (JPU) atau kebijakan mutlak majelis hakim sidang.
            </div>
          </div>
        </div>

        {/* G. Kesimpulan & Rekomendasi Taktis (Conclusion block) */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-950/20 via-indigo-900/10 to-transparent rounded-2xl border border-indigo-500/15 print-card space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold border-b border-indigo-500/15 pb-2.5">
            <Gavel className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display text-base tracking-wide uppercase">G. Kesimpulan & Rekomendasi Langkah Taktis</h3>
          </div>
          
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
            {r.kesimpulan}
          </p>

          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <p className="text-slate-500 flex items-center gap-1.5 font-light">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dikeluarkan otomatis berdasarkan parameter model hukum LexAI RI.</span>
            </p>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="font-mono text-slate-300">LexAI Paralegal AI Hub</span>
            </div>
          </div>
        </div>

      </div>

      {/* Optional supporting evidence metadata display */}
      {caseData.evidence && (
        <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 text-xs text-slate-400 flex items-start space-x-3 italic font-light no-print">
          <FileText className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <span><strong>Daftar Bukti Pendukung Terkait:</strong> {caseData.evidence}</span>
        </div>
      )}

      {/* Back button */}
      <div className="pt-4 flex justify-between items-center no-print">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-850 hover:text-white rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer"
        >
          Kembali ke Dashboard
        </button>

        <span className="text-[10px] text-slate-600 font-mono tracking-wider">
          LEXAI-SECURE-SANDBOX-ANALYSIS
        </span>
      </div>
    </div>
  );
}
