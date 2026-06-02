// src/pages/Dashboard.jsx
import React from "react";
import { ArrowRight, Sparkles, X, Map } from "lucide-react";

// Hooks
import { useDashboardData } from "../hooks/useDashboardData";
import { useTourGuide } from "../hooks/useTourGuide";
import { useAiInsight } from "../hooks/useAiInsight";

// Components
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCards from "../components/dashboard/StatCards";
import VideoMonitor from "../components/dashboard/VideoMonitor";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import AiDecisionSupport from "../components/dashboard/AiDecisionSupport";
import DangerLog from "../components/dashboard/DangerLog";

export default function Dashboard({ alerts, showAnalytics = true }) {
  const dashboardData = useDashboardData(alerts);
  const {
    compliantCount,
    violationCount,
    violationsOnly,
    realProdScore,
    safetyIndex,
  } = dashboardData;

  const {
    tourStep,
    showTourPrompt,
    startTour,
    dismissPrompt,
    nextTour,
    skipTour,
  } = useTourGuide();

  const { aiInsight, isGeneratingInsight, fetchAiInsight } = useAiInsight();

  // 🔥 SMART POSITIONING: Tour Guide akan menghindar dari menu yang sedang menyala
  const getTourPositionClasses = () => {
    switch (tourStep) {
      case 1: // Menu Atas nyala -> Tour di tengah agak ke bawah
        return "top-[40%] md:top-[35%] left-1/2 -translate-x-1/2";
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: // Menu Kiri nyala -> Tour menghindar ke Kanan
        return "top-1/2 -translate-y-1/2 right-[5%] md:right-[10%] xl:right-[15%]";
      case 7:
      case 8: // Menu Kanan nyala -> Tour menghindar ke Kiri
        return "top-1/2 -translate-y-1/2 left-[5%] md:left-[10%] xl:left-[15%]";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none";
    }
  };

  // 🔥 ARROW POINTER: Bikin panah yang nunjuk ke arah menu
  const getArrowClasses = () => {
    switch (tourStep) {
      case 1: // Nunjuk ke atas
        return "absolute top-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] border-l border-t border-slate-200 dark:border-zinc-800 rotate-45";
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: // Nunjuk ke kiri
        return "absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#121214] border-l border-b border-slate-200 dark:border-zinc-800 rotate-45";
      case 7:
      case 8: // Nunjuk ke kanan
        return "absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#121214] border-r border-t border-slate-200 dark:border-zinc-800 rotate-45";
      default:
        return "hidden";
    }
  };

  return (
    // 🔥 FIX PADDING BAWAH: Halaman balik normal, nggak ada ruang kosong (pb-10 md:pb-6)
    <main className="px-4 md:px-8 pb-10 md:pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 relative overflow-y-auto custom-scrollbar">
      <DashboardHeader />

      {/* --- UI NOTIF TOUR (Glow Biru, Atas Tengah, Eye-catching) --- */}
      {showTourPrompt && tourStep === 0 && (
        <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[9999] bg-white dark:bg-[#121214] p-4 rounded-2xl shadow-[0_15px_40px_rgba(37,99,235,0.25)] border border-blue-500/30 w-[90%] max-w-[420px] animate-in slide-in-from-top-10 fade-in duration-500 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={dismissPrompt}
            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-full"
          >
            <X size={14} />
          </button>

          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 animate-pulse shadow-inner">
            <Sparkles size={20} />
          </div>

          <div className="flex-1 text-center sm:text-left pr-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-zinc-100">
              Panduan Interaktif AI
            </h4>
            <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Pelajari cara membaca dashboard intelijen K3 ini dalam 1 menit.
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 relative z-50">
            <button
              onClick={dismissPrompt}
              className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={startTour}
              className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Mulai Tour
            </button>
          </div>
        </div>
      )}

      {/* --- UI TOUR OVERLAY (Background Gelap) --- */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-[10000] transition-opacity duration-500" />
      )}

      {/* --- SMART FLOATING TOUR GUIDE (Nggak Nutupin Menu) --- */}
      {tourStep > 0 && (
        <div
          // Transisi pakai cubic-bezier biar pergerakannya mulus dan elegan saat pindah posisi
          className={`fixed z-[10002] w-[85%] max-w-[320px] bg-white dark:bg-[#121214] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-zinc-800 p-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${getTourPositionClasses()}`}
        >
          {/* Panah Penunjuk */}
          <div className={getArrowClasses()}></div>

          <div className="flex justify-between items-center mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                {tourStep}
              </div>
              <h3 className="font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest text-[11px]">
                Fitur {tourStep}
              </h3>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
              {tourStep}/8
            </span>
          </div>

          <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed relative z-10">
            Perhatikan elemen yang menonjol di layar. AI akan memperbarui data
            pada komponen ini secara real-time berdasarkan tangkapan kamera.
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/60 relative z-10">
            <button
              onClick={skipTour}
              className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Akhiri Tour
            </button>
            <button
              onClick={nextTour}
              className="px-5 py-2.5 bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {tourStep === 8 ? "SELESAI" : `LANJUT`} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* --- KOMPONEN UTAMA (Yang disorot saat Tour) --- */}
      <StatCards
        compliantCount={compliantCount}
        violationCount={violationCount}
        realProdScore={realProdScore}
        safetyIndex={safetyIndex}
        tourStep={tourStep}
      />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-5 w-full flex-shrink-0 lg:flex-1 lg:min-h-0 pb-6">
        <div
          className={`w-full lg:col-span-8 flex flex-col gap-4 flex-shrink-0 lg:min-h-0 transition-all duration-500 ${tourStep >= 2 && tourStep <= 6 ? "relative z-[10001] ring-4 ring-blue-500/20 rounded-3xl" : ""}`}
        >
          <VideoMonitor data={dashboardData} tourStep={tourStep} />
          {showAnalytics && (
            <AnalyticsCharts
              compliantCount={compliantCount}
              violationCount={violationCount}
              violationsOnly={violationsOnly}
              tourStep={tourStep}
            />
          )}
        </div>

        <div
          className={`w-full lg:col-span-4 flex flex-col gap-4 flex-shrink-0 lg:min-h-0 transition-all duration-500 ${tourStep >= 7 ? "relative z-[10001] ring-4 ring-blue-500/20 rounded-3xl" : ""}`}
        >
          <AiDecisionSupport
            aiInsight={aiInsight}
            isGeneratingInsight={isGeneratingInsight}
            onFetchInsight={() =>
              fetchAiInsight(violationsOnly, violationCount, realProdScore)
            }
            tourStep={tourStep}
          />
          <DangerLog violationsOnly={violationsOnly} tourStep={tourStep} />
        </div>
      </div>
    </main>
  );
}
