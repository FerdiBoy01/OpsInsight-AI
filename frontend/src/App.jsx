// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Cpu, Info, X } from "lucide-react";

// Import Components & Pages
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CameraManager from "./pages/CameraManager";
import Login from "./pages/Login";
import ExecutiveInsights from "./pages/ExecutiveInsights";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";

// 🔥 URL AZURE
const API_BASE_URL =
  "https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net";
const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
const MAX_MEMORY_ALERTS = 200;

function AppContent() {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [safetyIndex, setSafetyIndex] = useState(100.0);
  const [violationData, setViolationData] = useState([
    { time: "08:00", violations: 0 },
    { time: "10:00", violations: 0 },
    { time: "12:00", violations: 0 },
    { time: "14:00", violations: 0 },
    { time: "Sekarang", violations: 0 },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(
    () => localStorage.getItem("opsinsight_show_analytics") !== "false",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("admin_auth") === "true",
  );
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  const handleLoginSuccess = () => {
    localStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const toggleAnalytics = () => {
    const val = !showAnalytics;
    setShowAnalytics(val);
    localStorage.setItem("opsinsight_show_analytics", val);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/incidents`);
        const data = await response.json();
        const slicedData = data.slice(0, MAX_MEMORY_ALERTS);
        setAlerts(slicedData);
        const penalty =
          slicedData.filter((a) => !a.detail.includes("Compliant")).length *
          0.5;
        setSafetyIndex(Math.max(0, parseFloat((100 - penalty).toFixed(1))));
        setViolationData((prev) => {
          const newData = [...prev];
          newData[newData.length - 1] = {
            ...newData[newData.length - 1],
            violations: slicedData.filter(
              (a) => !a.detail.includes("Compliant"),
            ).length,
          };
          return newData;
        });
      } catch (error) {
        console.error("Gagal menarik data Azure:", error);
      }
    };

    if (isAuthenticated) fetchHistory();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("new_safety_alert", (data) => {
      setAlerts((prev) => {
        const newAlerts = [data, ...prev];
        return newAlerts.length > MAX_MEMORY_ALERTS
          ? newAlerts.slice(0, MAX_MEMORY_ALERTS)
          : newAlerts;
      });
      if (!data.detail.includes("Compliant")) {
        setSafetyIndex((prev) =>
          Math.max(0, parseFloat((prev - 0.5).toFixed(1))),
        );
        setViolationData((prev) => {
          const newData = [...prev];
          newData[newData.length - 1] = {
            ...newData[newData.length - 1],
            violations: newData[newData.length - 1].violations + 1,
          };
          return newData;
        });
      }
    });

    return () => {
      clearInterval(timer);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_safety_alert");
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Login onLogin={handleLoginSuccess} />;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-300 font-sans overflow-hidden transition-colors duration-300 relative">
      {/* 🧩 KOMPONEN SIDEBAR */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarHovered={isSidebarHovered}
        setIsSidebarHovered={setIsSidebarHovered}
        currentTime={currentTime}
        setIsAboutOpen={setIsAboutOpen}
      />

      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-slate-50 dark:bg-[#09090b]">
        {/* 🧩 KOMPONEN NAVBAR */}
        <Navbar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isConnected={isConnected}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          handleLogout={handleLogout}
        />

        {/* 🧩 KONTEN UTAMA (ROUTES) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  alerts={alerts}
                  safetyIndex={safetyIndex}
                  violationData={violationData}
                  showAnalytics={showAnalytics}
                />
              }
            />
            <Route
              path="/executive-insights"
              element={<ExecutiveInsights alerts={alerts} />}
            />
            <Route path="/reports" element={<Reports alerts={alerts} />} />
            <Route
              path="/cameras"
              element={<CameraManager alerts={alerts} />}
            />
            <Route
              path="/settings"
              element={
                <Settings
                  showAnalytics={showAnalytics}
                  toggleAnalytics={toggleAnalytics}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </div>
      </div>

      {/* MODAL ABOUT SYSTEM */}
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
                className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 p-2 rounded-full"
              >
                <X size={18} />
              </button>
              <Cpu size={48} className="mb-4 opacity-80" />
              <h3 className="text-2xl font-black uppercase">OpsInsight AI</h3>
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
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl"
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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
