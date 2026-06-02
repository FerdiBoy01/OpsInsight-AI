// src/pages/Reports.jsx
import React from "react";
import { useReportsData } from "../hooks/useReportsData";
import ReportsChart from "../components/reports/ReportsChart";
import ReportsStats from "../components/reports/ReportsStats";
import ReportsFilterBar from "../components/reports/ReportsFilterBar";
import ReportsTable from "../components/reports/ReportsTable";

export default function Reports({ alerts }) {
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterDate,
    setFilterDate,
    filterLocation,
    setFilterLocation,
    chartView,
    setChartView,
    availableLocations,
    filteredAlerts,
    paginatedAlerts, // Data yang sudah dipotong
    currentPage,
    setCurrentPage,
    totalPages, // Kontrol Halaman
    chartData,
    totalRekaman,
    totalPelanggaran,
    totalAman,
    handleExportCSV,
  } = useReportsData(alerts);

  return (
    <main className="px-4 mt-2 md:px-8 pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/60 rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-sm flex flex-col lg:flex-row gap-6 md:gap-8 transition-colors flex-shrink-0">
        <ReportsChart
          chartView={chartView}
          setChartView={setChartView}
          chartData={chartData}
        />
        <ReportsStats
          totalRekaman={totalRekaman}
          totalPelanggaran={totalPelanggaran}
          totalAman={totalAman}
        />
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col shadow-sm transition-colors duration-500 flex-1 min-h-[400px]">
        <ReportsFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          availableLocations={availableLocations}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterType={filterType}
          setFilterType={setFilterType}
          handleExportCSV={handleExportCSV}
        />

        {/* 🔥 PERBAIKAN: Kirim props paginasi ke Table */}
        <ReportsTable
          paginatedAlerts={paginatedAlerts}
          totalEntri={filteredAlerts.length}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </main>
  );
}
