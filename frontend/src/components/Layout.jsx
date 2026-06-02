import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Cpu, Info, X } from "lucide-react";

export default function Layout({
  children,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarHovered,
  setIsSidebarHovered,
  currentTime,
  setIsAboutOpen,
  isConnected,
  isDarkMode,
  setIsDarkMode,
  handleLogout,
  isAboutOpen,
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-300 font-sans overflow-hidden transition-colors duration-300 relative">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarHovered={isSidebarHovered}
        setIsSidebarHovered={setIsSidebarHovered}
        currentTime={currentTime}
        setIsAboutOpen={setIsAboutOpen}
      />

      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-slate-50 dark:bg-[#09090b]">
        <Navbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isConnected={isConnected}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300">
          {children}
        </main>
      </div>

      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md"
            onClick={() => setIsAboutOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#121214] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-8 text-white relative">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              <Cpu size={48} className="mb-4 opacity-80" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                OpsInsight AI
              </h3>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                v1.0.4 Enterprise MVP
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg h-max text-blue-600">
                  <Info size={20} />
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
                  OpsInsight AI adalah sistem berbasis AI untuk memonitor
                  aktivitas pekerja, produktivitas, dan keselamatan secara
                  real-time.
                </p>
              </div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-colors shadow-lg cursor-pointer"
              >
                Kembali Ke Dasbor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
