// src/components/reports/ReportsTable.jsx
import React from "react";
import {
  CheckCircle,
  ShieldAlert,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { terjemahkanDetail, getSafeImageUrl } from "../../utils/helpers";

export default function ReportsTable({
  paginatedAlerts,
  totalEntri,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto w-full flex-1 custom-scrollbar min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#121214] transition-colors border-b border-slate-200 dark:border-zinc-800">
            <tr className="text-slate-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-4 md:px-6 py-3">Waktu Terdeteksi</th>
              <th className="px-4 md:px-6 py-3">ID Kejadian</th>
              <th className="px-4 md:px-6 py-3">Analisis Objek AI</th>
              <th className="px-4 md:px-6 py-3">Titik Lokasi</th>
              <th className="px-4 md:px-6 py-3 text-center">Visual Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest italic"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert, idx) => {
                const d = new Date(alert.timestamp);
                const isCompliant =
                  alert.type === "safety_compliant" ||
                  alert.detail.includes("Compliant");
                const finalImageUrl = getSafeImageUrl(alert.image_url);

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/20 transition-colors group"
                  >
                    <td className="px-4 md:px-6 py-2 md:py-2.5 whitespace-nowrap">
                      <div className="text-slate-900 dark:text-zinc-200 text-[10px] md:text-[11px] font-black tracking-tight">
                        {d.toLocaleTimeString("id-ID")}
                      </div>
                      <div className="text-slate-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold mt-0.5">
                        {d.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] text-slate-400 dark:text-zinc-600 font-mono font-bold">
                      #
                      {alert._id ? alert._id.slice(-6).toUpperCase() : "SIM-OK"}
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-2.5">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border w-max ${isCompliant ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600"}`}
                      >
                        {isCompliant ? (
                          <CheckCircle size={10} md:size={12} />
                        ) : (
                          <ShieldAlert size={10} md:size={12} />
                        )}
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">
                          {terjemahkanDetail(alert.detail)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] text-slate-600 dark:text-zinc-400 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={10} className="text-slate-400" />{" "}
                        {alert.zone}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-2.5">
                      <div className="flex justify-center">
                        {finalImageUrl ? (
                          <a
                            href={finalImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-7 md:w-12 md:h-8 bg-slate-200 dark:bg-zinc-900 rounded-lg border border-slate-300 dark:border-zinc-700 overflow-hidden block relative group/img transition-all hover:ring-2 hover:ring-slate-400"
                          >
                            <img
                              src={finalImageUrl}
                              alt="Evidence"
                              loading="lazy"
                              className="w-full h-full object-cover grayscale-[0.3] group-hover:img:grayscale-0 transition-all"
                            />
                          </a>
                        ) : (
                          <div className="text-[8px] md:text-[9px] text-slate-300 dark:text-zinc-700 font-black italic">
                            NO IMAGE
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 FOOTER TABEL: KONTROL PAGINASI */}
      <div className="px-4 md:px-6 py-3 bg-slate-50 dark:bg-[#09090b] border-t border-slate-200 dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-600">
          <Info size={12} />
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">
            Total Data: {totalEntri} Entri
          </p>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
