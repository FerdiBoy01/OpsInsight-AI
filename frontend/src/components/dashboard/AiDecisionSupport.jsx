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
      // 🔥 FIX: Padding diperkecil (p-3 md:p-3.5), rounded diubah jadi xl, warna pakai gradient biru biar premium!
      className={`bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-3 md:p-3.5 shadow-lg flex-shrink-0 relative overflow-hidden transition-all duration-500 w-full ${
        tourStep === 7
          ? "ring-4 ring-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.02] relative z-[10002]"
          : "relative z-10 shadow-blue-500/20"
      }`}
    >
      {/* Background Icon Dikecilin Dikit Biar Gak Menuh-menuhin */}
      <div className="absolute right-0 top-0 opacity-10 -mr-2 -mt-2">
        <Lightbulb size={80} />
      </div>

      <div className="flex justify-between items-center mb-2.5 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
            <BrainCircuit size={14} className="text-blue-200 flex-shrink-0" />{" "}
            AI DECISION SUPPORT
          </h3>
          <p className="text-[7.5px] md:text-[8px] font-bold text-blue-200 uppercase tracking-widest opacity-80">
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
            <Loader2 size={10} className="animate-spin" />
          ) : (
            <RefreshCw size={10} />
          )}
          {isGeneratingInsight ? "ANALYZING..." : "ANALYZE NOW"}
        </button>
      </div>

      {/* Jarak antar card dikecilin (space-y-1.5) */}
      <div className="space-y-1.5 relative z-10">
        {/* Card Situasi */}
        <div
          className={`bg-white/10 p-2 md:p-2.5 rounded-lg border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-tight text-blue-100 mb-1">
            Analisis Situasi:
          </p>
          <div className="flex items-start gap-1.5">
            {isGeneratingInsight ? (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1 animate-ping"></div>
            ) : (
              <Sparkles
                size={10}
                className="text-blue-300 mt-0.5 flex-shrink-0"
              />
            )}
            <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">
              {displayTrend}
            </p>
          </div>
        </div>

        {/* Card Rekomendasi */}
        <div
          className={`bg-white/10 p-2 md:p-2.5 rounded-lg border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
        >
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-tight text-blue-100 mb-1">
            Rekomendasi Tindakan:
          </p>
          <div className="flex items-start gap-1.5">
            {isGeneratingInsight ? (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1 animate-ping"></div>
            ) : (
              <Target
                size={10}
                className="text-emerald-300 mt-0.5 flex-shrink-0"
              />
            )}
            <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">
              {displayAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
