// src/components/camera/CameraList.jsx
import React from "react";
import { Video, CheckCircle2, PlayCircle, Trash2 } from "lucide-react";

export default function CameraList({ cameras, handleSwitch, handleDelete }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-[250px]">
      <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-3 uppercase tracking-widest shrink-0">
        Daftar Kamera Tersedia
      </h4>

      <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-2">
        {cameras.length === 0 ? (
          <div className="p-6 md:p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800/60 transition-colors duration-500">
            <Video
              size={28}
              className="mx-auto text-slate-300 dark:text-zinc-600 mb-3"
            />
            <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Belum ada kamera
            </p>
          </div>
        ) : (
          cameras.map((cam) => (
            <div
              key={cam._id}
              className={`group flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 border relative overflow-hidden ${
                cam.isActive
                  ? "bg-white dark:bg-[#121214] border-slate-200 dark:border-zinc-700 shadow-sm"
                  : "bg-slate-50 dark:bg-[#09090b] border-transparent hover:border-slate-200 dark:hover:border-zinc-800"
              }`}
            >
              {/* 🔥 GARIS TIPIS SEBAGAI INDIKATOR AKTIF, BUKAN BACKGROUND BIRU LEBAY */}
              {cam.isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              )}

              <div className="flex-1 min-w-0 pr-3 pl-2">
                <h5 className="text-slate-900 dark:text-zinc-100 font-bold text-xs flex items-center gap-2 truncate">
                  {cam.name}
                  {cam.isActive && (
                    <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={12} strokeWidth={2.5} /> AKTIF
                    </span>
                  )}
                </h5>
                <p className="text-slate-500 dark:text-zinc-500 text-[10px] mt-1 font-mono truncate">
                  {cam.url}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                {!cam.isActive && (
                  <button
                    onClick={() => handleSwitch(cam._id)}
                    title="Ganti ke Kamera ini"
                    className="p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-lg transition-all cursor-pointer"
                  >
                    <PlayCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cam._id)}
                  title="Hapus Kamera"
                  className="p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-rose-100 dark:hover:bg-rose-500/10 text-slate-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-500 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
