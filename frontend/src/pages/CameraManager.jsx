// src/pages/CameraManager.jsx
import React from "react";
import { useCameraManager } from "../hooks/useCameraManager";

import CameraHeader from "../components/camera/CameraHeader";
import CameraForm from "../components/camera/CameraForm";
import CameraList from "../components/camera/CameraList";
import CameraPreview from "../components/camera/CameraPreview";

export default function CameraManager() {
  const {
    cameras,
    newName,
    setNewName,
    newUrl,
    setNewUrl,
    previewUrl,
    activeCam,
    handleAdd,
    handleSwitch,
    handleDelete,
  } = useCameraManager();

  return (
    // 🔥 PERBAIKAN: Halaman dikunci (overflow-hidden) agar anti goyang
    <main className="px-4 md:px-8 pb-6 pt-4 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Kotak Utama pembungkus seluruh konten */}
      <div className="bg-white dark:bg-[#121214] mt-2 rounded-3xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col flex-1 overflow-hidden transition-colors duration-500">
        <CameraHeader />

        {/* Area Konten Bawah (Form di kiri, Layar di kanan) */}
        <div className="p-4 md:p-6 flex flex-col-reverse lg:flex-row gap-6 md:gap-8 flex-1 overflow-hidden">
          <div className="w-full lg:w-5/12 flex flex-col gap-6 overflow-hidden">
            <CameraForm
              newName={newName}
              setNewName={setNewName}
              newUrl={newUrl}
              setNewUrl={setNewUrl}
              handleAdd={handleAdd}
            />

            <CameraList
              cameras={cameras}
              handleSwitch={handleSwitch}
              handleDelete={handleDelete}
            />
          </div>

          <CameraPreview previewUrl={previewUrl} activeCam={activeCam} />
        </div>
      </div>
    </main>
  );
}
