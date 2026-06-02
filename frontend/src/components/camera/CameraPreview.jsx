// src/components/camera/CameraPreview.jsx
import React, { useState, useEffect } from "react";
import { MonitorPlay, Info, BarChart2 } from "lucide-react";

export default function CameraPreview({ previewUrl, activeCam }) {
  // 🔥 State untuk mendeteksi apakah stream video error/mati
  const [hasError, setHasError] = useState(false);

  // Kalau ganti kamera (previewUrl berubah), reset errornya biar nyoba nge-load lagi
  useEffect(() => {
    setHasError(false);
  }, [previewUrl]);

  return (
    <div className="w-full lg:w-7/12 flex flex-col overflow-hidden h-[300px] lg:h-auto">
      <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 shrink-0">
        <MonitorPlay size={14} className="text-slate-500" /> Pratinjau Sistem
        Aktual
      </h4>

      {/* Kontainer Video */}
      <div className="flex-1 bg-[#09090b] rounded-2xl overflow-hidden relative shadow-inner ring-1 ring-black/5 dark:ring-white/5 flex flex-col items-center justify-center">
        {/* Badge RAW FEED (Kiri Atas) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 rounded-lg text-white text-[9px] font-bold tracking-widest backdrop-blur-sm border border-white/10 w-max shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] ${hasError || !previewUrl ? "bg-rose-500" : "bg-rose-500 animate-pulse"}`}
            ></span>{" "}
            RAW FEED
          </div>
        </div>

        {/* Badge Nama Kamera (Kanan Bawah) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg text-white font-mono text-[10px] uppercase tracking-widest backdrop-blur-sm border border-white/10 shadow-sm font-bold truncate max-w-[150px] md:max-w-none">
            {activeCam?.name || "OFFLINE"}
          </div>
        </div>

        {/* 🔥 LOGIKA TAMPILAN: Jika ada URL dan tidak error = Tampil Video. Jika tidak = Tampil UI Signal Lost */}
        {previewUrl && !hasError ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover z-10"
            // Kalau gambar/stream putus, trigger UI Signal Lost
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center z-10 w-full px-4 text-center">
            {/* Ikon Sinyal dengan titik merah berkedip */}
            <div className="relative mb-5">
              <div className="w-16 h-16 bg-[#121214] border border-zinc-800/80 rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart2 size={28} className="text-rose-500" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#09090b]"></div>
            </div>

            {/* Teks Error */}
            <h3 className="text-rose-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-2.5 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              Signal Lost - Auto Reconnecting...
            </h3>
            <p className="text-zinc-500 text-[8px] md:text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              Menghubungi Edge Node Kembali
            </p>
          </div>
        )}
      </div>

      {/* Info Warning */}
      <div className="mt-4 p-4 bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800/60 rounded-2xl flex items-start gap-3 shrink-0">
        <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-slate-600 dark:text-zinc-400 text-[10px] md:text-[11px] leading-relaxed font-medium">
          Pratinjau menampilkan aliran video mentah. Saat mengganti kamera
          aktif, AI membutuhkan jeda{" "}
          <strong className="text-slate-900 dark:text-zinc-200">
            ~3 detik
          </strong>{" "}
          untuk kalibrasi ulang.
        </p>
      </div>
    </div>
  );
}
