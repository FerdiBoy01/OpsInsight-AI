// src/components/dashboard/DashboardHeader.jsx
import React from "react";
import { Sparkles, BrainCircuit, Zap, BarChart3, Bot } from "lucide-react";

export default function DashboardHeader() {
  return (
    // 🔥 FIX: Margin bottom dikecilkan dari mb-4 jadi mb-2.5 biar layar bawah makin lega
    <div className="mb-2.5 shrink-0 flex flex-col gap-1.5 w-full mt-2 relative z-10">
      {/* Teks Slogan Utama - Dibikin lebih rapat, margin atas dihapus */}
      <p className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-1.5 truncate pr-2">
        <Sparkles
          size={12}
          className="text-blue-500 flex-shrink-0 animate-pulse"
        />
        End-to-end AI system for real-time workforce monitoring, safety
        compliance, and decision support.
      </p>

      {/* Jejeran Badge Fitur AI - Padding & Gap diperkecil */}
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[7.5px] md:text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-300">
        <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/20 px-2 py-1 rounded-md shadow-sm transition-colors hover:border-blue-500/50">
          <BrainCircuit size={10} /> AI Detection
        </span>

        <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">
          •
        </span>

        <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 px-2 py-1 rounded-md shadow-sm transition-colors hover:border-emerald-500/50">
          <Zap size={10} /> Real-time Monitoring
        </span>

        <span className="text-slate-300 dark:text-zinc-700 hidden lg:inline">
          •
        </span>

        <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 px-2 py-1 rounded-md shadow-sm transition-colors hover:border-indigo-500/50">
          <BarChart3 size={10} /> Analytics Dashboard
        </span>

        <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">
          •
        </span>

        <span className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-500/20 px-2 py-1 rounded-md shadow-sm transition-colors hover:border-purple-500/50">
          <Bot size={10} /> Decision Support
        </span>
      </div>
    </div>
  );
}
