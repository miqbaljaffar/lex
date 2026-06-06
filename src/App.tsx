import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import DashboardMain from "./components/DashboardMain";
import AnalysisForm from "./components/AnalysisForm";
import AnalysisResultView from "./components/AnalysisResultView";
import HelpCenter from "./components/HelpCenter";
import { AnalysisCase } from "./types";
import { Gavel, HelpCircle, Shield, PhoneCall } from "lucide-react";

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [cases, setCases] = useState<AnalysisCase[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("guest@lexai.internal");

  // Fetch all cases from full-stack backend
  const fetchCases = async () => {
    try {
      const response = await fetch("/api/cases");
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data kasus:", err);
      setAppError("Koneksi gagal terhubung ke server LexAI.");
    }
  };

  // Fetch system logs history from full-stack backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data log:", err);
    }
  };

  // Fetch current user profile dynamically from backend
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
      }
    } catch (err) {
      console.error("Gagal mengambil data profil:", err);
    }
  };

  // Run on startup
  useEffect(() => {
    fetchCases();
    fetchHistory();
    fetchUserProfile();
  }, []);

  // Handler: Toggle Bookmark
  const handleToggleBookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/cases/${id}/bookmark`, {
        method: "POST"
      });
      if (response.ok) {
        // Refresh local states
        fetchCases();
        fetchHistory();
      }
    } catch (err) {
      console.error("Gagal memperbarui bookmark:", err);
    }
  };

  // Handler: Delete Case
  const handleDeleteCase = async (id: string) => {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        if (selectedCaseId === id) {
          setSelectedCaseId(null);
          setView("dashboard");
        }
        // Refresh local states
        fetchCases();
        fetchHistory();
      }
    } catch (err) {
      console.error("Gagal menghapus kasus:", err);
    }
  };

  // Handler: Select Specific Case to inspect reasoning
  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setView("result_detail");
  };

  // Handler: Compile Demo Case instantly
  const handleCreateDemoCase = async () => {
    try {
      const response = await fetch("/api/create-demo-case", {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        // Refresh and set viewport to looking at this new compiled model
        await fetchCases();
        await fetchHistory();
        handleSelectCase(data.id);
      }
    } catch (err) {
      console.error("Gagal membuat data demo:", err);
    }
  };

  // Handler: Analysis submit completed in subform
  const handleAnalyzeComplete = (newCase: AnalysisCase) => {
    setCases((prev) => [newCase, ...prev]);
    fetchHistory(); // refresh logs
    setSelectedCaseId(newCase.id);
    setView("result_detail");
  };

  // Helper count getters
  const bookmarkedCount = cases.filter((c) => c.isBookmarked).length;
  const caseCount = cases.length;

  // Active compiled case model
  const activeCase = cases.find((c) => c.id === selectedCaseId);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#060a13] text-slate-100 selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar 
        currentView={view} 
        setView={(v) => {
          setView(v);
          if (v !== "result_detail") {
            setSelectedCaseId(null);
          }
        }} 
        bookmarkedCount={bookmarkedCount}
        caseCount={caseCount}
        userEmail={userEmail}
      />

      {/* 2. Main Body Content panels */}
      <main className="flex-1 min-h-screen p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {appError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center justify-between no-print">
            <span>{appError}</span>
            <button onClick={() => setAppError(null)} className="text-slate-400 hover:text-white font-mono font-bold">[Tutup]</button>
          </div>
        )}

        {/* View Routing Switch */}
        {view === "landing" && (
          <LandingPage 
            onStart={() => setView("dashboard")} 
            caseCount={caseCount}
          />
        )}

        {view === "dashboard" && (
          <DashboardMain 
            cases={cases}
            history={history}
            onSelectCase={handleSelectCase}
            onDeleteCase={handleDeleteCase}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToAnalyze={() => setView("analyze")}
            onCreateDemoCase={handleCreateDemoCase}
            userEmail={userEmail}
          />
        )}

        {view === "analyze" && (
          <AnalysisForm onAnalyzeComplete={handleAnalyzeComplete} />
        )}

        {view === "bookmarks" && (
          <DashboardMain 
            cases={cases.filter(c => c.isBookmarked)}
            history={history}
            onSelectCase={handleSelectCase}
            onDeleteCase={handleDeleteCase}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToAnalyze={() => setView("analyze")}
            onCreateDemoCase={handleCreateDemoCase}
            userEmail={userEmail}
          />
        )}

        {view === "result_detail" && activeCase ? (
          <AnalysisResultView 
            caseData={activeCase}
            onBack={() => setView("dashboard")}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : view === "result_detail" ? (
          <div className="p-8 text-center glass-panel rounded-2xl max-w-sm mx-auto space-y-4">
            <h4 className="text-sm font-semibold">Kasus Tidak Aktif</h4>
            <p className="text-xs text-slate-500">Mungkin berkas hukum telah dihapus. Mohon kembali ke dashboard.</p>
            <button onClick={() => setView("dashboard")} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs">Menuju Dashboard</button>
          </div>
        ) : null}

        {view === "faq" && (
          <HelpCenter />
        )}

      </main>
    </div>
  );
}
