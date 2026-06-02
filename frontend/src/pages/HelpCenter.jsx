// src/pages/HelpCenter.jsx
import React, { useState } from "react";
import {
  BookOpen,
  Video,
  BrainCircuit,
  FileText,
  ChevronDown,
  ShieldCheck,
  Activity,
  HelpCircle,
} from "lucide-react";

export default function HelpCenter() {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      icon: Video,
      title: "Bagaimana cara menghubungkan CCTV atau IP Camera?",
      content:
        "Masuk ke menu 'Kamera IoT' di panel sebelah kiri. Pada form 'Tambah Sumber Baru', masukkan nama zona (misal: Gudang Utama) dan URL stream RTSP atau link video MP4 Anda. Klik 'Simpan Konfigurasi'. Sistem akan otomatis memproses aliran video tersebut.",
    },
    {
      icon: BrainCircuit,
      title: "Cara menghidupkan dan mematikan Deteksi AI?",
      content:
        "Buka 'Dasbor Utama'. Di bagian atas pemutar video, terdapat tombol berlabel 'AI On' (berwarna biru). Klik tombol tersebut untuk beralih ke 'AI Off' (Mode Normal). Saat AI dimatikan, sistem akan berfungsi sebagai monitor CCTV biasa tanpa merekam log pelanggaran.",
    },
    {
      icon: Activity,
      title: "Apa itu Auto-Healing Protocol?",
      content:
        "Jika koneksi internet atau aliran CCTV terputus, layar tidak akan blank atau error. Sistem OpsInsight dilengkapi Auto-Healing yang akan mencoba menghubungkan ulang (reconnect) ke node kamera setiap 3 detik secara otomatis hingga koneksi kembali stabil.",
    },
    {
      icon: FileText,
      title: "Bagaimana cara mengekspor laporan insiden ke CSV/Excel?",
      content:
        "Buka menu 'Laporan Harian'. Anda dapat memfilter data berdasarkan Tanggal, Lokasi, atau Status Kepatuhan. Setelah data yang diinginkan tampil di tabel, klik tombol 'CSV' di sudut kanan atas untuk mengunduh laporan yang siap dibuka di Microsoft Excel.",
    },
    {
      icon: ShieldCheck,
      title: "Apa itu Safety Index Score?",
      content:
        "Safety Index adalah angka ukur (0-100) kesehatan K3 di area kerja Anda secara real-time. Skor ini dihitung secara dinamis oleh AI berdasarkan rasio jumlah pekerja yang patuh SOP dibandingkan dengan jumlah insiden pelanggaran yang terdeteksi.",
    },
  ];

  return (
    // 🔥 PERBAIKAN 1: Halaman utama dibikin overflow-hidden biar nggak goyang
    <main className="px-4 md:px-8 pb-6 pt-4 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* HEADER TETAP (Tidak ikut ke-scroll) */}
        <div className="mb-5 md:mb-6 flex-shrink-0 mt-2">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Pusat Bantuan
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 font-medium mt-1">
            Panduan operasional dan dokumentasi sistem OpsInsight AI.
          </p>
        </div>

        {/* KOTAK KONTEN UTAMA (Yang membungkus area scroll) */}
        <div className="bg-white dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col flex-1 overflow-hidden transition-colors">
          {/* BANNER STICKY (Bagian atas kotak yang diam) */}
          <div className="flex items-center gap-4 p-4 md:p-6 bg-slate-50 dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800/60 flex-shrink-0 z-10">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">
                FAQ & Dokumentasi
              </h3>
              <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium leading-relaxed">
                Klik pada topik di bawah ini untuk membaca panduan lebih detail.
              </p>
            </div>
          </div>

          {/* 🔥 PERBAIKAN 2: Area scroll cuma ada di dalam sini (custom-scrollbar) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-2">
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                // 🔥 PERBAIKAN 3: Style baru yang super mulus, tanpa border jelek
                <div
                  key={index}
                  className={`group rounded-2xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-blue-50/50 dark:bg-blue-500/5 ring-1 ring-blue-500/20"
                      : "bg-transparent hover:bg-slate-50 dark:hover:bg-[#1a1a1c]"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isActive ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-blue-500"
                        }`}
                      >
                        <faq.icon size={18} />
                      </div>
                      <span
                        className={`font-bold text-[11px] md:text-xs uppercase tracking-wider transition-colors duration-300 ${
                          isActive
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white"
                        }`}
                      >
                        {faq.title}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                        isActive
                          ? "rotate-180 text-blue-600"
                          : "group-hover:text-slate-600 dark:group-hover:text-zinc-300"
                      }`}
                    />
                  </button>

                  {/* Animasi Buka Tutup yang lebih pas (max-h-96 biar gak kepotong kalau teks panjang) */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-4 pb-5 pt-0 ml-[52px]">
                      <p className="text-[11px] md:text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium text-justify pr-2">
                        {faq.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
