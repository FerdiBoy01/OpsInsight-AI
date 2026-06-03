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
    // 🔥 FIX: gap dikurangi (gap-2 md:gap-3) dan margin bawah dikurangi (mb-3) biar gak makan tempat
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3 flex-shrink-0 transition-all duration-500 ${
        tourStep === 1 ? "relative z-[10001]" : "relative z-10"
      }`}
    >
      {stats.map((item, i) => (
        <div
          key={i}
          // 🔥 FIX: padding dikecilkan dari p-4 jadi p-2.5, rounded-2xl jadi rounded-xl
          className={`bg-white dark:bg-[#121214] p-2.5 md:p-3 rounded-xl border border-slate-200 dark:border-zinc-800/60 flex flex-col shadow-sm transition-all group hover:border-blue-500/50 ${
            tourStep === 1
              ? "ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]"
              : "relative z-10"
          }`}
        >
          {/* Header Kartu */}
          <div className="flex items-center justify-between mb-1.5 relative z-10">
            <p className="text-slate-500 dark:text-zinc-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none truncate pr-1">
              {item.label}
            </p>
            {/* AI Generated tidak disembunyikan, ukurannya dipaskan */}
            <span className="text-[6px] md:text-[6.5px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
              AI Generated
            </span>
          </div>

          {/* Area Nilai & Ikon */}
          <div className="flex items-center gap-2.5 mb-0.5 relative z-10 flex-1">
            <div className={`p-1.5 md:p-2 rounded-lg ${item.bg} flex-shrink-0`}>
              <item.icon className={item.color} size={16} />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-0.5">
                {/* Font Size Angka dikecilkan dari text-2xl ke text-xl */}
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-zinc-100 leading-none">
                  {item.val}
                </h3>
                <span className="text-[7px] md:text-[8px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  {item.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi Bawah (Tetap ada, tapi rapi dan dipisah garis tipis) */}
          <p className="text-[7px] md:text-[7.5px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5 pt-1.5 border-t border-slate-100 dark:border-zinc-800/60 relative z-10 leading-tight">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
