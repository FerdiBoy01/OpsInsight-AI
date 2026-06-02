// src/components/reports/ReportsStats.jsx
import React from "react";
import { Database, AlertTriangle, CheckCircle } from "lucide-react";

export default function ReportsStats({
  totalRekaman,
  totalPelanggaran,
  totalAman,
}) {
  const stats = [
    {
      label: "Total Database",
      val: totalRekaman,
      unit: "Log",
      icon: Database,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/5",
      border: "border-blue-100 dark:border-blue-500/20",
    },
    {
      label: "Pelanggaran APD",
      val: totalPelanggaran,
      unit: "Kejadian",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-500/5",
      border: "border-rose-100 dark:border-rose-500/20",
    },
    {
      label: "Kondisi Patuh",
      val: totalAman,
      unit: "Validasi",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full lg:w-[280px]">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`${s.bg} ${s.border} border p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4`}
        >
          <div
            className={`p-2 md:p-2.5 bg-white dark:bg-zinc-800 rounded-xl ${s.color} shadow-sm`}
          >
            <s.icon size={18} />
          </div>
          <div>
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 leading-none mb-1">
              {s.label}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-zinc-100">
                {s.val}
              </p>
              <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">
                {s.unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
