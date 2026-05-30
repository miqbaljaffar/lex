import React from "react";
import { 
  Gavel, 
  LayoutDashboard, 
  PlusCircle, 
  Bookmark, 
  History as HistoryIcon,
  HelpCircle,
  LogOut,
  Sparkles,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  bookmarkedCount: number;
  caseCount: number;
  userEmail: string;
}

export default function Sidebar({ 
  currentView, 
  setView, 
  bookmarkedCount, 
  caseCount,
  userEmail 
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: "landing", label: "Halaman Utama", icon: Sparkles },
    { id: "dashboard", label: "Dashboard Saya", icon: LayoutDashboard, badge: caseCount },
    { id: "analyze", label: "Mulai Analisis AI", icon: PlusCircle, isPrimary: true },
    { id: "bookmarks", label: "Bookmark Hukum", icon: Bookmark, badge: bookmarkedCount },
    { id: "faq", label: "Pusat Hukum & FAQ", icon: HelpCircle }
  ];

  const handleNav = (viewId: string) => {
    setView(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-40 px-4 flex items-center justify-between no-print">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView("landing")}>
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-500/20">
            <Gavel className="w-5 h-5 text-indigo-100" />
          </div>
          <span className="font-display font-semibold text-lg tracking-wider text-slate-100 bg-linear-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text">
            Lex<span className="text-indigo-400">AI</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          id="mobile-menu-btn"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm no-print"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-950 border-r border-slate-900 z-50 flex flex-col justify-between p-6 transition-transform duration-300 no-print
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Top Header */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav("landing")}>
            <div className="p-2.5 bg-linear-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/10">
              <Gavel className="w-6 h-6 text-indigo-50" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-xl tracking-wider text-slate-100">
                  Lex<span className="text-transparent bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text">AI</span>
                </span>
                <span className="text-[10px] font-semibold font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  RI v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-tight">AI Legal Reasoning System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" id="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium
                    ${isActive 
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-inner" 
                      : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-transparent"}
                    ${item.isPrimary ? "bg-linear-to-r from-indigo-600 to-indigo-700/80 text-white font-semibold shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600" : ""}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive && !item.isPrimary ? 'text-indigo-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="mt-auto space-y-4 pt-6 border-t border-slate-900/80">
          <div className="flex items-start space-x-3 p-3 bg-slate-900/40 rounded-xl border border-slate-900/80">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow border border-slate-800">
              {userEmail.substring(0, 2)}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-semibold text-slate-300 truncate">{userEmail}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-medium">Praktisi / Tamu</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setView("landing")}
            className="w-full flex items-center justify-center space-x-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors py-2 rounded-lg hover:bg-slate-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
