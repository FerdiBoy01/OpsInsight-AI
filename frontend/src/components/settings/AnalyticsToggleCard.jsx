// src/components/settings/AnalyticsToggleCard.jsx
import React from "react";

export default function AnalyticsToggleCard({
  showAnalytics,
  toggleAnalytics,
}) {
  return (
    <div className="glass-panel rounded-3xl border border-slate-200 dark:border-zinc-800/60 p-4 md:p-6 shadow-sm max-w-2xl transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-widest mb-1">
            Modul Analitik 24 Jam
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
            Tampilkan grafik Tren 24 Jam dan Pola Waktu Insiden di bawah layar
            kamera.
            <br />
            <span className="italic font-medium">
              💡 Tips: Jika dimatikan, layar CCTV akan membesar.
            </span>
          </p>
        </div>

        <button
          onClick={toggleAnalytics}
          className={`relative inline-flex h-7 w-12 self-end sm:self-auto flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
            showAnalytics ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              showAnalytics ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
