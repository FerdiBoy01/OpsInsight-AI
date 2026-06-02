// src/components/settings/SettingsHeader.jsx
import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="mb-6">
      <h3 className="text-slate-900 dark:text-zinc-100 font-black tracking-widest text-xs uppercase flex items-center gap-2 mb-1">
        <SettingsIcon size={16} className="text-blue-600" /> Preferensi
        Antarmuka
      </h3>
      <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-[0.1em]">
        Kustomisasi Tampilan Dasbor Utama
      </p>
    </div>
  );
}
