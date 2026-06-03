// src/components/dashboard/DangerLog.jsx
import React from "react";
import { TriangleAlert, ShieldAlert, ShieldCheck } from "lucide-react";
import { terjemahkanDetail } from "../../utils/helpers";

export default function DangerLog({ violationsOnly, tourStep }) {
  return (
    <div
      // 🔥 FIX: Hapus tinggi hardcode (h-[350px]), ganti dengan 'flex-1 min-h-0' biar dia pas ngisi sisa layar bawah dan bisa scroll mandiri.
      className={`bg-white dark:bg-[#121214] rounded-xl border border-slate-200 dark:border-zinc-800/60 flex flex-col flex-1 min-h-0 w-full shadow-sm overflow-hidden transition-all duration-500 ${
        tourStep === 8
          ? "ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.01] relative z-[10002]"
          : "relative z-10"
      }`}
    >
      {/* Header Log - Dibikin lebih rapat */}
      <div className="px-3 py-2 md:py-2.5 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center bg-slate-50 dark:bg-[#09090b] shrink-0 relative z-10">
        <div className="flex items-center gap-1.5">
          <TriangleAlert size={12} className="text-rose-500" />
          <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-[9px] uppercase tracking-widest">
            Log Bahaya Real-Time
          </h3>
        </div>
        <span className="text-[6.5px] md:text-[7px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-500/20">
          Detected by AI Engine
        </span>
      </div>

      {/* Area Daftar Log (Scrollable) */}
      <div className="p-2 md:p-2.5 overflow-y-auto space-y-1.5 flex-1 min-h-0 custom-scrollbar relative z-10">
        {violationsOnly.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <ShieldCheck
              size={28}
              strokeWidth={1.5}
              className="text-emerald-500/50"
            />
            <p className="text-[8px] font-bold uppercase mt-1.5 tracking-widest">
              Area Steril & Aman
            </p>
          </div>
        ) : (
          violationsOnly.slice(0, 15).map((a, i) => (
            <div
              key={i}
              // 🔥 FIX: Padding dipress, hover scale dihapus biar gak goyang-goyang pas di-scroll, diganti nyala border
              className="flex gap-2.5 items-start p-2 bg-rose-50 dark:bg-rose-500/5 rounded-lg border border-rose-100 dark:border-rose-500/20 transition-colors hover:border-rose-400 dark:hover:border-rose-500/50"
            >
              <ShieldAlert
                size={12}
                className="text-rose-500 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-slate-900 dark:text-zinc-100 text-[9px] md:text-[10px] font-bold leading-tight">
                  {terjemahkanDetail(a.detail)}
                </p>
                <p className="text-[7.5px] md:text-[8px] text-slate-500 uppercase font-bold mt-0.5 tracking-wider">
                  {new Date(a.timestamp).toLocaleTimeString()} •{" "}
                  {a.zone || "GUDANG"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
