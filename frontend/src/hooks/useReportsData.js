// src/hooks/useReportsData.js
import { useState, useMemo, useEffect } from "react";
import { terjemahkanDetail, getSafeImageUrl } from "../utils/helpers";

export function useReportsData(alerts) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("ALL");
  const [chartView, setChartView] = useState("DAILY");

  // 🔥 STATE BARU: PAGINASI
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Jumlah data per halaman

  const availableLocations = useMemo(() => {
    return Array.from(
      new Set(alerts.map((a) => a.zone || "Lokasi Belum Diatur")),
    );
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const detailIndo = terjemahkanDetail(alert.detail).toLowerCase();
      const zoneIndo = (alert.zone || "").toLowerCase();

      const matchesSearch =
        detailIndo.includes(searchTerm.toLowerCase()) ||
        zoneIndo.includes(searchTerm.toLowerCase());

      let matchesType = true;
      const isCompliant =
        alert.type === "safety_compliant" || alert.detail.includes("Compliant");
      if (filterType === "VIOLATION") matchesType = !isCompliant;
      else if (filterType === "COMPLIANT") matchesType = isCompliant;

      let matchesDate = true;
      if (filterDate) {
        const d = new Date(alert.timestamp);
        const alertDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        matchesDate = alertDateStr === filterDate;
      }

      let matchesLocation = true;
      if (filterLocation !== "ALL") {
        matchesLocation =
          (alert.zone || "Lokasi Belum Diatur") === filterLocation;
      }

      return matchesSearch && matchesType && matchesDate && matchesLocation;
    });
  }, [alerts, searchTerm, filterType, filterDate, filterLocation]);

  // 🔥 LOGIKA RESET HALAMAN JIKA USER KETIK SEARCH/FILTER
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterDate, filterLocation]);

  // 🔥 LOGIKA POTONG DATA (PAGINASI)
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlerts, currentPage]);

  const chartData = useMemo(() => {
    const baseLabels =
      chartView === "DAILY"
        ? ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
        : ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
    return baseLabels.map((label) => ({
      name: label,
      insiden: Math.floor(Math.random() * 5),
      aman: Math.floor(Math.random() * 10) + 5,
    }));
  }, [chartView]);

  const totalRekaman = filteredAlerts.length;
  const totalPelanggaran = filteredAlerts.filter(
    (a) => !a.detail.includes("Compliant"),
  ).length;
  const totalAman = totalRekaman - totalPelanggaran;

  const handleExportCSV = () => {
    if (filteredAlerts.length === 0) return alert("Data kosong!");
    let csvContent = "Tanggal,ID,Status,Detail,Lokasi,Link Foto\n";
    filteredAlerts.forEach((a) => {
      const d = new Date(a.timestamp);
      const safeImageUrl = getSafeImageUrl(a.image_url) || "Tidak Ada Foto";
      const statusText = a.detail.includes("Compliant") ? "AMAN" : "BAHAYA";
      const translatedDetail = terjemahkanDetail(a.detail);
      csvContent += `${d.toLocaleDateString()} ${d.toLocaleTimeString()},${a._id ? a._id.slice(-6) : "N/A"},${statusText},"${translatedDetail}","${a.zone}","${safeImageUrl}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_K3_${Date.now()}.csv`);
    link.click();
  };

  return {
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
    paginatedAlerts, // Data yang dikirim ke tabel
    currentPage,
    setCurrentPage,
    totalPages, // Info halaman
    chartData,
    totalRekaman,
    totalPelanggaran,
    totalAman,
    handleExportCSV,
  };
}
