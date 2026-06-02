// src/components/camera/CameraHeader.jsx
import React from "react";
import { Video } from "lucide-react";

export default function CameraHeader() {
  return (
    <div className="px-4 md:px-6 py-4 md:py-5 bg-slate-50 dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800/60 flex justify-between items-center flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        {/* 🔥 Ganti dari biru glow jadi kotak elegan */}
        <div className="p-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-zinc-300 flex-shrink-0 shadow-sm">
          <Video size={20} />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">
            Konfigurasi Kamera
          </h3>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium leading-relaxed">
            Manajemen sumber video CCTV dan aliran IP Camera untuk AI
          </p>
        </div>
      </div>
    </div>
  );
}
