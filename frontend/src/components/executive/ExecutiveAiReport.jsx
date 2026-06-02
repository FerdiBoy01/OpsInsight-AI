// src/components/executive/ExecutiveAiReport.jsx
import React from "react";
import {
  BrainCircuit,
  ShieldAlert,
  Sparkles,
  Loader2,
  ArrowRight,
  Target,
} from "lucide-react";

export default function ExecutiveAiReport({
  aiInsight,
  isGeneratingInsight,
  fetchAiInsight,
}) {
  return (
    // 🔥 FIX: Pakai h-full biar memanjang otomatis ngikutin tinggi grafik di kirinya
    <div className="bg-slate-50 dark:bg-[#09090b] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm relative overflow-hidden flex flex-col h-full min-h-[400px] transition-colors w-full">
      {/* Header AI */}
      <div className="flex items-center gap-3 mb-4 relative z-10 border-b border-slate-200 dark:border-zinc-800/80 pb-3">
        <div className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-blue-600 dark:text-blue-500 shadow-sm">
          <BrainCircuit size={16} />
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-zinc-100">
            AI Executive Report
          </h3>
          <p className="text-[8px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-bold mt-0.5">
            Powered by Gemini LLM
          </p>
        </div>
      </div>

      {/* Konten Utama (Bisa Di-Scroll Kalau Kepanjangan) */}
      <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div
          className={`transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-rose-500" /> Analisis Situasi
          </h4>
          <p className="text-[10px] md:text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed font-medium text-justify">
            {aiInsight.ringkasan}
          </p>
        </div>

        <div
          className={`transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2 mt-1 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-500" /> Rekomendasi
            Tindakan
          </h4>
          {aiInsight.rekomendasi.length > 0 ? (
            <ul className="space-y-2">
              {aiInsight.rekomendasi.map((rek, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center text-[8px] font-black flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[10px] md:text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {rek}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[10px] text-slate-400 italic">
              Belum ada rekomendasi.
            </p>
          )}
        </div>

        {/* 🔥 MENU TAMBAHAN BARU: INDIKATOR RISIKO DOMINAN */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-zinc-800/80">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
            <Target size={12} className="text-amber-500" /> Dominasi Faktor
            Risiko
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">
                <span>Pelanggaran APD Dasar</span>
                <span className="text-rose-500 font-black">68%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-rose-500 h-1.5 rounded-full"
                  style={{ width: "68%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">
                <span>Intrusi Area Bahaya</span>
                <span className="text-amber-500 font-black">24%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">
                <span>Anomali Pergerakan</span>
                <span className="text-blue-500 font-black">8%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: "8%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi di Bawah */}
      <button
        onClick={fetchAiInsight}
        disabled={isGeneratingInsight}
        className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0"
      >
        {isGeneratingInsight ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <BrainCircuit size={14} />
        )}
        {isGeneratingInsight ? "SEDANG MEMPROSES..." : "MINTA ANALISIS ULANG"}{" "}
        <ArrowRight size={12} />
      </button>
    </div>
  );
}
