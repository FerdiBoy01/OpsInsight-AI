// src/components/executive/ExecutiveKpiCards.jsx
import React from "react";
import { Target, AlertTriangle, MapPin, TrendingUp } from "lucide-react";

export default function ExecutiveKpiCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-5 flex-shrink-0">
      {/* CARD 1: SAFETY INDEX */}
      <div className="bg-white dark:bg-[#121214] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mt-1">
            Safety Index Score
          </p>
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
            <Target size={16} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.safetyIndex}
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
            /100
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-max px-2 py-1 rounded-full uppercase tracking-wider">
          <TrendingUp size={10} strokeWidth={3} /> Real-time
        </div>
      </div>

      {/* CARD 2: TOTAL INSIDEN */}
      <div className="bg-white dark:bg-[#121214] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mt-1">
            Total Pelanggaran
          </p>
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
            <AlertTriangle size={16} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.totalPelanggaran}
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
            Insiden
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          Dalam 7 Hari Terakhir
        </div>
      </div>

      {/* CARD 3: AREA RISIKO */}
      <div className="bg-white dark:bg-[#121214] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mt-1">
            Area Risiko Tertinggi
          </p>
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2
            className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate pb-1"
            title={stats.areaRisiko}
          >
            {stats.areaRisiko.length > 15
              ? stats.areaRisiko.substring(0, 15) + "..."
              : stats.areaRisiko}
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 w-max px-2 py-1 rounded-full uppercase tracking-wider">
          Menyumbang {stats.persentaseRisiko}% Insiden
        </div>
      </div>
    </div>
  );
}
