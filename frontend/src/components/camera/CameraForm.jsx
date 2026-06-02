// src/components/camera/CameraForm.jsx
import React from "react";
import { Plus, Save } from "lucide-react";

export default function CameraForm({
  newName,
  setNewName,
  newUrl,
  setNewUrl,
  handleAdd,
}) {
  return (
    <div className="bg-slate-50 dark:bg-[#09090b] p-4 md:p-5 rounded-2xl flex-shrink-0 transition-colors duration-500">
      <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
        <Plus size={14} className="text-blue-600 dark:text-blue-400" /> Tambah
        Sumber Baru
      </h4>
      <form onSubmit={handleAdd} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Nama Lokasi / Zona (Misal: GUDANG UTAMA)"
            className="w-full bg-white dark:bg-[#121214] text-slate-900 dark:text-zinc-200 text-xs font-bold rounded-xl px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
            placeholder="URL Stream (RTSP/MP4)"
            className="w-full bg-white dark:bg-[#121214] text-slate-900 dark:text-zinc-200 text-xs font-mono font-bold rounded-xl px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 mt-1"
        >
          <Save size={16} /> SIMPAN KONFIGURASI
        </button>
      </form>
    </div>
  );
}
