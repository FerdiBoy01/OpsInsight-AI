// src/components/executive/ExecutiveHeader.jsx
import React from "react";
import { TrendingUp, Download, Loader2 } from "lucide-react";

export default function ExecutiveHeader({ isExporting, handleExport }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-2">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="text-blue-600 dark:text-blue-500" /> Executive
          Insights
        </h1>
        <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 font-medium mt-1.5">
          Ringkasan performa K3 dan rekomendasi strategis berbasis AI untuk
          level Manajerial.
        </p>
      </div>

      {/* 🔥 TOMBOL OUTLINE YANG LEBIH ELEGAN, BUKAN BLOK PUTIH/HITAM */}
      <button
        onClick={handleExport}
        className="bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 text-[10px] md:text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm"
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        ) : (
          <Download size={16} className="text-blue-500" />
        )}
        {isExporting ? "GENERATING PDF..." : "UNDUH PDF"}
      </button>
    </div>
  );
}
