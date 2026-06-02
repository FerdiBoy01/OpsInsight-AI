import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Sun, Moon, LogOut, UserCheck } from "lucide-react";

export default function Navbar({
  setIsMobileMenuOpen,
  isConnected,
  isDarkMode,
  setIsDarkMode,
  handleLogout,
}) {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/") return "Pantauan Area Kerja";
    if (location.pathname === "/executive-insights")
      return "Ringkasan Eksekutif";
    if (location.pathname === "/reports") return "Laporan Harian";
    if (location.pathname === "/cameras") return "Kamera IoT";
    if (location.pathname === "/settings") return "Pengaturan Sistem";
    return "Dasbor Utama";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/50 flex items-center justify-between px-4 md:px-8 py-4 flex-shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">
            {getPageTitle()}
          </h2>
          <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold">
            Operational Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <div className="flex items-center space-x-2 text-[10px] font-bold">
            <span className="text-slate-500 dark:text-zinc-600">DB:</span>
            <span className="text-blue-600 dark:text-blue-400 uppercase">
              ONLINE
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-bold mt-1">
            <span className="text-slate-500 dark:text-zinc-600">AI:</span>
            <span
              className={`${isConnected ? "text-emerald-500" : "text-rose-500"} uppercase`}
            >
              {isConnected ? "READY" : "OFF"}
            </span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-zinc-800/50"></div>

        <div className="flex items-center space-x-1 md:space-x-2 bg-slate-100 dark:bg-zinc-900 p-1 md:p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 transition-all cursor-pointer"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all group cursor-pointer"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>

        <div className="flex items-center space-x-3 md:ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-slate-900 dark:text-zinc-200 font-bold text-sm leading-none text-nowrap">
              Ferdi Pratama
            </p>
            <p className="text-slate-500 dark:text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">
              Super Admin
            </p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <UserCheck size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
