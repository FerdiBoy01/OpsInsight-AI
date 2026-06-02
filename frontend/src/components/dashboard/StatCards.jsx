// src/components/dashboard/StatCards.jsx
import React from "react";
import { ShieldCheck, History, Target, ShieldAlert } from "lucide-react";

export default function StatCards({
  compliantCount,
  violationCount,
  realProdScore,
  safetyIndex,
  tourStep,
}) {
  const stats = [
    {
      label: "Log Sesuai SOP",
      val: compliantCount,
      unit: "Deteksi Aman",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      sub: "Total kepatuhan alat pelindung",
    },
    {
      label: "Kejadian Bahaya",
      val: violationCount,
      unit: "Insiden APD",
      icon: History,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      sub: "Pelanggaran SOP yang tercatat",
    },
    {
      label: "Rasio Kepatuhan",
      val: realProdScore,
      unit: "%",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      sub: "Persentase ketaatan area",
    },
    {
      label: "Indeks Keselamatan",
      val: safetyIndex,
      unit: "/100",
      icon: ShieldAlert,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      sub: "Skor kesehatan K3 saat ini",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 flex-shrink-0 transition-all duration-500 ${
        tourStep === 1 ? "relative z-[10001]" : "relative z-10"
      }`}
    >
      {stats.map((item, i) => (
        <div
          key={i}
          className={`bg-white dark:bg-[#121214] p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col shadow-sm transition-all group hover:border-blue-500/50 ${
            tourStep === 1
              ? "ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]"
              : "relative z-10"
          }`}
        >
          <div className="flex items-center justify-between mb-2 relative z-10">
            <p className="text-slate-500 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none truncate">
              {item.label}
            </p>
            <span className="hidden sm:inline-block text-[7px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              AI Generated
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2 relative z-10">
            <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}>
              <item.icon className={item.color} size={18} />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-zinc-100 leading-none">
                  {item.val}
                </h3>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-tighter">
                  {item.unit}
                </span>
              </div>
            </div>
          </div>
          <p className="hidden md:block text-[9px] text-slate-400 dark:text-zinc-500 italic font-medium mt-2 relative z-10">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
