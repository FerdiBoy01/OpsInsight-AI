// src/components/dashboard/DangerLog.jsx
import React from "react";
import { TriangleAlert, ShieldAlert, ShieldCheck } from "lucide-react";
import { terjemahkanDetail } from "../../utils/helpers";

export default function DangerLog({ violationsOnly, tourStep }) {
  return (
    <div
      className={`bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col h-[350px] md:h-[400px] w-full shadow-sm overflow-hidden transition-all duration-500 ${
        tourStep === 8
          ? "ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.01] relative z-[10002]"
          : "relative z-10"
      }`}
    >
      <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center bg-slate-50 dark:bg-[#09090b] relative z-10">
        <div className="flex items-center gap-2">
          <TriangleAlert size={14} className="text-rose-500" />
          <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-[10px] uppercase tracking-widest">
            Log Bahaya Real-Time
          </h3>
        </div>
        <span className="text-[7px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-500/20">
          Detected by AI Engine
        </span>
      </div>

      <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar relative z-10">
        {violationsOnly.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <ShieldCheck size={32} strokeWidth={1} />
            <p className="text-[9px] font-bold uppercase mt-2">
              Area Steril & Aman
            </p>
          </div>
        ) : (
          violationsOnly.slice(0, 15).map((a, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-2.5 bg-rose-50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/20 transition-all hover:scale-[1.02]"
            >
              <ShieldAlert
                size={14}
                className="text-rose-500 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-slate-900 dark:text-zinc-100 text-[11px] font-bold leading-tight">
                  {terjemahkanDetail(a.detail)}
                </p>
                <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">
                  {new Date(a.timestamp).toLocaleTimeString()} • {a.zone}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
