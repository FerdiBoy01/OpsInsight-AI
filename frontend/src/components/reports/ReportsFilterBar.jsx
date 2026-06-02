// src/components/reports/ReportsFilterBar.jsx
import React from "react";
import { Search, MapPin, Download, Calendar } from "lucide-react";

export default function ReportsFilterBar({
  searchTerm,
  setSearchTerm,
  filterLocation,
  setFilterLocation,
  availableLocations,
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  handleExportCSV,
}) {
  return (
    <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-zinc-800/60 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-slate-50 dark:bg-[#09090b] gap-4 transition-colors flex-shrink-0">
      <h3 className="text-slate-900 dark:text-zinc-100 font-black tracking-widest text-[11px] md:text-xs uppercase flex items-center gap-2">
        <Calendar size={14} md:size={16} className="text-blue-600" /> Riwayat
        Insiden
      </h3>

      <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full xl:w-auto">
        {/* SEARCH */}
        <div className="relative col-span-2 sm:col-auto flex-1 min-w-[180px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari Log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 text-[10px] md:text-[11px] font-bold rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* FILTER LOKASI */}
        <div className="relative col-span-1 sm:col-auto w-full sm:w-auto">
          <MapPin
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 pl-8 pr-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
          >
            <option value="ALL">SEMUA LOKASI</option>
            {availableLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* FILTER TANGGAL */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full sm:w-auto col-span-1 sm:col-auto bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 px-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
        />

        {/* FILTER STATUS */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto col-span-1 sm:col-auto bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 px-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
        >
          <option value="ALL">SEMUA STATUS</option>
          <option value="VIOLATION">PELANGGARAN</option>
          <option value="COMPLIANT">PATUH SOP</option>
        </select>

        {/* EXPORT CSV */}
        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto col-span-1 sm:col-auto flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] md:text-[11px] font-black tracking-widest shadow-md active:scale-95 transition-all"
        >
          <Download size={14} /> CSV
        </button>
      </div>
    </div>
  );
}
