import React, { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Bookmark, 
  Gavel, 
  FileText, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { AnalysisCase } from "../types";

interface DashboardMainProps {
  cases: AnalysisCase[];
  history: any[];
  onSelectCase: (id: string) => void;
  onDeleteCase: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onNavigateToAnalyze: () => void;
  onCreateDemoCase: () => void;
  userEmail: string;
}

export default function DashboardMain({
  cases,
  history,
  onSelectCase,
  onDeleteCase,
  onToggleBookmark,
  onNavigateToAnalyze,
  onCreateDemoCase,
  userEmail
}: DashboardMainProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "bookmarks">("all");

  // Filter cases based on search & tab choice
  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chronology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "bookmarks") {
      return matchesSearch && c.isBookmarked;
    }
    return matchesSearch;
  });

  // Calculate Metrics
  const totalCases = cases.length;
  const totalBookmarks = cases.filter((c) => c.isBookmarked).length;
  const categoriesCount = cases.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  
  // Find top used category
  let topCategory = "Belum Ada";
  let maxCount = 0;
  Object.keys(categoriesCount).forEach((cat) => {
    if (categoriesCount[cat] > maxCount) {
      maxCount = categoriesCount[cat];
      topCategory = cat;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-main-wrapper">
      
      {/* 1. Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-900 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Sesi Aktif Terautentikasi</span>
          </div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
            Selamat Datang di Portal Hukum, <span className="text-transparent bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text font-extrabold">{userEmail.split("@")[0]}</span>
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-xl leading-relaxed">
            Gunakan LexAI untuk menganalisis, memetakan, dan merumuskan penalaran hukum formal secara cepat berdasarkan legislasi Indonesia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 flex-shrink-0">
          <button
            onClick={onNavigateToAnalyze}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mulai Analisis Kasus Baru</span>
          </button>

          {/* Quick Demo seeder */}
          {cases.length === 0 && (
            <button
              onClick={onCreateDemoCase}
              className="px-4 py-3 bg-slate-900 border border-slate-800 text-indigo-300 font-medium text-xs rounded-xl hover:bg-slate-850 hover:border-indigo-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Muat Kasus Demo (Instan)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Micro Statistics Bento row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="dashboard-stats">
        {/* Total Analyses */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-start space-x-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/10">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider block uppercase">TOTAL ANALISIS</span>
            <p className="text-2xl font-display font-semibold text-white mt-0.5">{totalCases}</p>
            <span className="text-[10px] text-slate-400 font-light mt-1 block">Kasus hukum dideklarasikan</span>
          </div>
        </div>

        {/* Bookmarked Cases */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-start space-x-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider block uppercase">ARSIP PENINGKATAN</span>
            <p className="text-2xl font-display font-semibold text-white mt-0.5">{totalBookmarks}</p>
            <span className="text-[10px] text-slate-400 font-light mt-1 block">Kasus di-bookmark aktif</span>
          </div>
        </div>

        {/* Categories most analyzed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-900 flex items-start space-x-4">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider block uppercase">RUMPUN HUKUM UTAMA</span>
            <p className="text-sm font-semibold text-slate-200 mt-2 truncate max-w-[180px]" title={topCategory}>
              {topCategory.split("-")[0].trim()}
            </p>
            <span className="text-[10px] text-slate-400 font-light block">Kategori paling sering diajukan</span>
          </div>
        </div>
      </section>

      {/* 3. Main Workspace Area: Searches, histories and logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Cases Explorer table/list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* View Selector Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900 self-start">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "all" ? "bg-slate-900 text-white border border-slate-800" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Semua Riwayat
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "bookmarks" ? "bg-slate-900 text-white border border-slate-800" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Bookmark ({totalBookmarks})
              </button>
            </div>

            {/* Live Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari analisis pas lampau..."
                className="w-full sm:w-60 bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Cases grid listing */}
          <div className="space-y-3" id="cases-list">
            {filteredCases.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-slate-900 text-center space-y-4">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-300">Belum Ada Analisis yang Cocok</h4>
                  <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                    {searchQuery 
                      ? "Tidak dapat menemukan berkas perkara yang mengandung kata kunci tersebut." 
                      : "Buat analisis pertamamu untuk menguji pemenuhan pasal regulasi Indonesia."}
                  </p>
                </div>
                {searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs transition-colors">
                    Reset Pencarian
                  </button>
                ) : (
                  <button onClick={onNavigateToAnalyze} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10">
                    Mulai Sekarang
                  </button>
                )}
              </div>
            ) : (
              filteredCases.map((caseItem) => {
                const r = caseItem.result;
                return (
                  <div 
                    key={caseItem.id}
                    id={`case-card-${caseItem.id}`}
                    className="glass-panel p-5 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300 group flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 cursor-pointer" onClick={() => onSelectCase(caseItem.id)}>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                            {caseItem.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {new Date(caseItem.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm md:text-base text-slate-200 group-hover:text-indigo-300 transition-colors pt-1">
                          {caseItem.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2 md:max-w-xl">
                          {caseItem.chronology}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0 z-10 no-print">
                        {/* Bookmark Trigger */}
                        <button
                          onClick={() => onToggleBookmark(caseItem.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            caseItem.isBookmarked 
                              ? "bg-amber-500/15 text-amber-500 border-amber-500/20" 
                              : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800"
                          }`}
                          title={caseItem.isBookmarked ? "Hapus Markah" : "Tambahkan Markah"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${caseItem.isBookmarked ? 'fill-amber-500' : ''}`} />
                        </button>
                        
                        {/* Delete Trigger */}
                        <button
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin menghapus arsip analisis kasus ini secara permanen dari server lokal?")) {
                              onDeleteCase(caseItem.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-950/40 transition-colors cursor-pointer"
                          title="Hapus Analisis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom analytic snapshot row */}
                    {r && (
                      <div className="border-t border-slate-900/60 pt-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-slate-300 font-light truncate max-w-xs">{r.klasifikasi}</span>
                          </div>
                          <span>•</span>
                          <span className="font-mono">Tinkat Keyakinan: <strong className="text-indigo-400 font-bold">{r.confidenceScore}%</strong></span>
                        </div>
                        
                        <button 
                          onClick={() => onSelectCase(caseItem.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 group-hover:translate-x-1.5 transition-transform cursor-pointer"
                        >
                          <span>Buka Laporan Hukum</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 col: System Logs (Activity History timeline) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-0.5 border-b border-slate-900">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              Riwayat Sistem & Aktivitas
            </h4>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-5" id="timeline-activity">
            <p className="text-[10px] text-slate-500 font-light leading-relaxed">
              Jejak waktu log terekam dalam modul sandbox lokal LexAI untuk menjaga autentisitas audit:
            </p>

            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-600 font-light italic">
                  Belum ada rekaman log aktivitas.
                </div>
              ) : (
                history.map((log) => {
                  let logText = "Aktivitas tidak terdefinisi";
                  let logColor = "bg-slate-900 text-slate-400 border-slate-800";
                  
                  if (log.action === "created") {
                    logText = `Melakukan kompilasi analisis hukum kasus "${log.caseTitle}"`;
                    logColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/10";
                  } else if (log.action === "bookmarked") {
                    logText = `Sematkan Bookmark kasus "${log.caseTitle}"`;
                    logColor = "bg-amber-500/10 text-amber-500 border-amber-500/10";
                  } else if (log.action === "unbookmarked") {
                    logText = `Hapus Bookmark kasus "${log.caseTitle}"`;
                    logColor = "bg-slate-900 text-slate-500 border-slate-800";
                  }

                  return (
                    <div key={log.id} className="relative flex items-start space-x-3 text-[11px] leading-relaxed">
                      {/* Badge indicator icon dot */}
                      <span className={`w-2 h-2 rounded-full self-start flex-shrink-0 mt-1.5 ${
                        log.action === 'created' ? 'bg-indigo-500Shadow animate-pulse bg-indigo-400' : log.action === 'bookmarked' ? 'bg-amber-400' : 'bg-slate-700'
                      }`} />
                      
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-slate-300 font-light truncate max-w-[210px]" title={logText}>
                          {logText}
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString("id-ID")} • {new Date(log.timestamp).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="pt-3 border-t border-slate-950/80 text-[10px] text-slate-500 font-light flex items-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span>Semua aktivitas terenkripsi aman secara lokal di server.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
