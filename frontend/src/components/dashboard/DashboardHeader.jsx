// src/components/dashboard/DashboardHeader.jsx
import React from "react";
import { Sparkles, BrainCircuit, Zap, BarChart3, Bot } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-4">
      <p className="text-[10px] mt-2 md:mt-3 font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <Sparkles size={12} className="text-blue-500 flex-shrink-0" />
        End-to-end AI system for real-time workforce monitoring, safety
        compliance, and decision support.
      </p>

      <div className="flex flex-wrap items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-300">
        <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
          <BrainCircuit size={10} md:size={12} /> AI Detection
        </span>
        <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">
          •
        </span>
        <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
          <Zap size={10} md:size={12} /> Real-time Monitoring
        </span>
        <span className="text-slate-300 dark:text-zinc-700 hidden lg:inline">
          •
        </span>
        <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm mt-1 sm:mt-0">
          <BarChart3 size={10} md:size={12} /> Analytics Dashboard
        </span>
        <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">
          •
        </span>
        <span className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm mt-1 sm:mt-0">
          <Bot size={10} md:size={12} /> Decision Support
        </span>
      </div>
    </div>
  );
}
