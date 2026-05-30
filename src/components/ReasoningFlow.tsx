import React from "react";
import { 
  FileText, 
  Search, 
  BookOpen, 
  Layers, 
  ClipboardCheck, 
  CheckCircle2,
  FileCheck2,
  ArrowRight
} from "lucide-react";

interface ReasoningFlowProps {
  currentStep?: number; // 0 to 5 indicating active step, or undefined if viewing final completed flow
  isCompleted?: boolean;
}

export default function ReasoningFlow({ currentStep = 5, isCompleted = true }: ReasoningFlowProps) {
  const steps = [
    {
      id: 0,
      title: "Input Kasus",
      desc: "Kronologi & Bukti",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 1,
      title: "Identifikasi Fakta",
      desc: "Menyaring Subjek/Objek",
      icon: Search,
      color: "from-cyan-500 to-teal-500"
    },
    {
      id: 2,
      title: "Pencocokan Regulasi",
      desc: "Mencari Ayat Terkait",
      icon: BookOpen,
      color: "from-teal-500 to-indigo-500"
    },
    {
      id: 3,
      title: "Analisis Unsur Pasal",
      desc: "Pecah Elemen Pidana/Perdata",
      icon: Layers,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 4,
      title: "Pertimbangan Hukum",
      desc: "Relevansi Alat Bukti",
      icon: ClipboardCheck,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 5,
      title: "Kesimpulan & Rekomendasi",
      desc: "Prospek Hukum Taktis",
      icon: FileCheck2,
      color: "from-pink-500 to-emerald-500"
    }
  ];

  return (
    <div className="w-full space-y-4 py-3" id="reasoning-flow-wrapper">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          Alur Penalaran Hukum AI (Reasoning Flow)
        </h4>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
          {isCompleted ? "Status: Selesai" : "Status: Menganalisis"}
        </span>
      </div>

      {/* Steps Visual Grid or Flow */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPast = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <div 
              key={step.id} 
              className={`
                relative p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-300
                ${isCurrent 
                  ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/5 scale-[1.02]" 
                  : isPast 
                    ? "bg-slate-950/40 border-slate-800" 
                    : "bg-slate-950/20 border-slate-950 text-slate-600"}
              `}
              id={`flow-step-${step.id}`}
            >
              {/* Connecting Line (Only desk/tablet) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 translate-y-[-50%] z-20">
                  <ArrowRight className={`w-3.5 h-3.5 ${isPast ? 'text-indigo-500' : 'text-slate-800'}`} />
                </div>
              )}

              {/* Top Row: Icon & Dot */}
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  p-1.5 rounded-lg border 
                  ${isCurrent 
                    ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/35" 
                    : isPast 
                      ? "bg-slate-900/80 text-emerald-400 border-slate-800" 
                      : "bg-slate-950 text-slate-700 border-slate-950"}
                `}>
                  <Icon className="w-4 h-4" />
                </div>

                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                )}
              </div>

              {/* Labels */}
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-mono font-medium text-slate-500">{(idx + 1).toString().padStart(2, "0")}</span>
                  <span className={`text-xs font-semibold tracking-tight truncate ${isUpcoming ? 'text-slate-600' : 'text-slate-200'}`}>
                    {step.title}
                  </span>
                </div>
                <p className={`text-[10px] font-light leading-snug line-clamp-1 ${isUpcoming ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
