// src/components/dashboard/AiDecisionSupport.jsx
import React from "react";
import {
  Lightbulb,
  BrainCircuit,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

export default function AiDecisionSupport({
  aiInsight,
  isGeneratingInsight,
  onFetchInsight,
  tourStep,
}) {
  // 🔥 TRIK SAAS: Ubah teks "Sistem Siap" jadi seolah-olah AI udah memantau dari awal
  const isDefaultTrend =
    aiInsight?.trend?.toLowerCase().includes("sistem siap") ||
    aiInsight?.trend?.toLowerCase().includes("tekan tombol");
  const isDefaultAction =
    aiInsight?.action?.toLowerCase().includes("menunggu") ||
    aiInsight?.action?.toLowerCase().includes("pembuatan rekomendasi");

  const displayTrend = isDefaultTrend
    ? "Memantau baseline aktivitas... Tingkat kepatuhan APD saat ini berada pada batas toleransi. Tidak terdeteksi anomali pergerakan massal di zona kritis."
    : aiInsight.trend;

  const displayAction = isDefaultAction
    ? "Lanjutkan protokol pemantauan standar. Pastikan sorotan kamera di Area Logistik tidak terhalang. Klik 'Analyze Now' untuk sinkronisasi data menyeluruh."
    : aiInsight.action;

  return (
    <div
      className={`bg-blue-600 text-white rounded-2xl p-5 shadow-lg flex-shrink-0 relative overflow-hidden transition-all duration-500 w-full ${
        tourStep === 7
          ? "ring-4 ring-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.02] relative z-[10002]"
          : "relative z-10 shadow-blue-500/20"
      }`}
    >
      <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4">
        <Lightbulb size={100} />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-1">
            <BrainCircuit size={14} className="text-blue-200 flex-shrink-0" />{" "}
            AI DECISION SUPPORT
          </h3>
          <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest opacity-80">
            Powered by Generative AI
          </p>
        </div>

        <button
          onClick={onFetchInsight}
          disabled={isGeneratingInsight}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border border-white/20 disabled:opacity-50 cursor-pointer flex-shrink-0"
          title="Minta AI Menganalisis Data Saat Ini"
        >
          {isGeneratingInsight ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} />
          )}
          {isGeneratingInsight ? "ANALYZING..." : "ANALYZE NOW"}
        </button>
      </div>

      <div className="space-y-2 relative z-10">
        <div
          className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest leading-tight text-blue-100 mb-1.5">
            Analisis Situasi:
          </p>
          <div className="flex items-start gap-2">
            {isGeneratingInsight ? (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1 animate-ping"></div>
            ) : (
              <Sparkles
                size={12}
                className="text-blue-300 mt-0.5 flex-shrink-0"
              />
            )}
            <p className="text-[10px] font-medium leading-relaxed">
              {displayTrend}
            </p>
          </div>
        </div>

        <div
          className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest leading-tight text-blue-100 mb-1.5">
            Rekomendasi Tindakan:
          </p>
          <div className="flex items-start gap-2">
            {isGeneratingInsight ? (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1 animate-ping"></div>
            ) : (
              <Target
                size={12}
                className="text-emerald-300 mt-0.5 flex-shrink-0"
              />
            )}
            <p className="text-[10px] font-medium leading-relaxed">
              {displayAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
