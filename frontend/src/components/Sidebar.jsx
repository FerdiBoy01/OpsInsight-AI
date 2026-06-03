// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  FileText,
  Video,
  X,
  HelpCircle,
  Settings as SettingsIcon,
  TrendingUp,
} from "lucide-react";

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarHovered,
  setIsSidebarHovered,
  setIsAboutOpen,
}) {
  const location = useLocation();
  const isExpanded = isSidebarHovered || isMobileMenuOpen;

  const navClass = (path) =>
    `flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 overflow-hidden ${
      location.pathname === path
        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm"
        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-transparent"
    } ${!isExpanded ? "justify-center" : "justify-start"}`;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[50] bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`z-[60] bg-white dark:bg-[#09090b] flex flex-col border-r border-slate-200 dark:border-zinc-800/50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-x-hidden flex-shrink-0
          ${isMobileMenuOpen ? "fixed inset-y-0 left-0 translate-x-0 w-64 shadow-2xl" : "fixed inset-y-0 left-0 -translate-x-full w-64"}
          md:relative md:translate-x-0 ${isExpanded ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* LOGO */}
        <div
          className={`pt-6 pb-6 flex items-center transition-all duration-300 ${isExpanded ? "px-6 justify-between" : "px-0 justify-center"}`}
        >
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-600 rounded-lg shadow-md shadow-blue-500/20 flex-shrink-0">
              <Activity className="text-white" size={20} strokeWidth={2} />
            </div>
            <h1
              className={`text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-32 opacity-100 ml-3" : "w-0 opacity-0 ml-0"}`}
            >
              OpsInsight<span className="text-blue-600"> AI</span>
            </h1>
          </div>
          {isMobileMenuOpen && (
            <button
              className="md:hidden text-slate-500 hover:text-slate-800 dark:text-zinc-400 flex-shrink-0 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* 🔥 KOTAK JAM LAMA DI SINI SUDAH KITA DEPAK / BUANG BIAR LEGA 🔥 */}

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-x-hidden">
          <Link
            to="/"
            className={navClass("/")}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Dasbor Utama"
          >
            <Activity size={20} strokeWidth={2} className="flex-shrink-0" />
            <span
              className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 ml-0"}`}
            >
              Dasbor Utama
            </span>
          </Link>
          <Link
            to="/executive-insights"
            className={navClass("/executive-insights")}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Executive Insights"
          >
            <TrendingUp size={20} strokeWidth={2} className="flex-shrink-0" />
            <span
              className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 ml-0"}`}
            >
              Executive Insights
            </span>
          </Link>
          <Link
            to="/reports"
            className={navClass("/reports")}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Laporan Harian"
          >
            <FileText size={20} strokeWidth={2} className="flex-shrink-0" />
            <span
              className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 ml-0"}`}
            >
              Laporan Harian
            </span>
          </Link>
          <Link
            to="/cameras"
            className={navClass("/cameras")}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Kamera & CCTV"
          >
            <Video size={20} strokeWidth={2} className="flex-shrink-0" />
            <span
              className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 ml-0"}`}
            >
              Kamera & CCTV
            </span>
          </Link>
          <Link
            to="/settings"
            className={navClass("/settings")}
            onClick={() => setIsMobileMenuOpen(false)}
            title="Pengaturan"
          >
            <SettingsIcon size={20} strokeWidth={2} className="flex-shrink-0" />
            <span
              className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 ml-3" : "opacity-0 w-0 ml-0"}`}
            >
              Pengaturan
            </span>
          </Link>
        </nav>

        {/* BOTTOM ACTION */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800/50">
          <Link
            to="/help"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative flex items-center justify-center text-blue-600 dark:text-blue-400 bg-blue-600/5 hover:bg-blue-600/10 border border-blue-500/20 transition-all duration-300 rounded-xl group hover:scale-[1.02] active:scale-95 cursor-pointer ${isExpanded ? "px-4 py-3 w-full" : "p-3 w-full"}`}
            title="Pusat Bantuan"
          >
            <HelpCircle
              size={20}
              strokeWidth={2.5}
              className="group-hover:rotate-12 transition-transform flex-shrink-0"
            />
            <span
              className={`font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 ml-0 hidden"}`}
            >
              Pusat Bantuan
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
