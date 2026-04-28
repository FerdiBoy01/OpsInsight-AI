import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Activity, FileText, LogOut, UserCheck, Cpu, Video, Info, Clock, Calendar, Sun, Moon, X, HelpCircle, ShieldCheck, Settings } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import CameraManager from './pages/CameraManager';
import Login from './pages/Login'; 

// 🔥 GANTI DENGAN URL AZURE KAMU
const API_BASE_URL = "https://api-opsinsight-ferdi.azurewebsites.net";

// ✅ Nyambungin Socket.IO ke Azure
const socket = io(API_BASE_URL, {
  transports: ['websocket', 'polling'] // Opsional tapi bagus buat kestabilan di Azure
});

function AppContent() {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [safetyIndex, setSafetyIndex] = useState(100.0);
  const [violationData, setViolationData] = useState([
    { time: '08:00', violations: 0 }, { time: '10:00', violations: 0 },
    { time: '12:00', violations: 0 }, { time: '14:00', violations: 0 }, { time: 'Sekarang', violations: 0 },
  ]);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  // ==========================================
  // STATE GLOBAL UNTUK MUNCULKAN GRAFIK
  // ==========================================
  const [showAnalytics, setShowAnalytics] = useState(() => {
    return localStorage.getItem('opsinsight_show_analytics') !== 'false'; // Default nyala
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_auth') === 'true'
  );

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; 
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleAnalytics = () => {
    const val = !showAnalytics;
    setShowAnalytics(val);
    localStorage.setItem('opsinsight_show_analytics', val);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchHistory = async () => {
      try {
        // ✅ Nembak API ke Azure
        const response = await fetch(`${API_BASE_URL}/api/incidents`);
        const data = await response.json();
        setAlerts(data);
        const penalty = data.length * 0.5;
        setSafetyIndex(Math.max(0, parseFloat((100 - penalty).toFixed(1))));
        setViolationData(prev => {
          const newData = [...prev];
          newData[newData.length - 1] = { ...newData[newData.length - 1], violations: data.length };
          return newData;
        });
      } catch (error) { console.error("Gagal menarik data dari Azure:", error); }
    };
    
    if (isAuthenticated) fetchHistory();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('new_safety_alert', (data) => {
      setAlerts((prev) => [data, ...prev]); 
      setSafetyIndex((prev) => Math.max(0, parseFloat((prev - 0.5).toFixed(1))));
      setViolationData((prev) => {
        const newData = [...prev];
        newData[newData.length - 1] = { ...newData[newData.length - 1], violations: newData[newData.length - 1].violations + 1 };
        return newData;
      });
    });

    return () => { 
      clearInterval(timer);
      socket.off('connect'); socket.off('disconnect'); socket.off('new_safety_alert'); 
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  const navClass = (path) => `flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all ${
    location.pathname === path 
      ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm" 
      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-transparent"
  }`;

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Pantauan Area Kerja';
    if (location.pathname === '/reports') return 'Laporan Harian (Database)';
    if (location.pathname === '/cameras') return 'Pengaturan Kamera IoT';
    if (location.pathname === '/settings') return 'Pengaturan Sistem';
    return 'Dasbor Utama';
  };

  const jam = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tanggal = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-800 dark:text-zinc-300 font-sans overflow-hidden transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-[#09090b] flex flex-col border-r border-slate-200 dark:border-zinc-800/50 flex-shrink-0 transition-colors duration-300">
        <div className="p-6 flex items-center space-x-3 mb-2">
          <div className="p-1.5 bg-blue-600 rounded-lg shadow-md shadow-blue-500/20">
             <Activity className="text-white" size={20} strokeWidth={2} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">OpsInsight<span className="text-blue-600"> AI</span></h1>
        </div>
        
        <div className="px-4 mb-4">
          <div className="bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/60 p-3 rounded-xl flex flex-col gap-2 transition-colors">
            <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100">
              <Clock size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold font-mono tracking-wider">{jam}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tanggal}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          <Link to="/" className={navClass("/")}><Activity size={18} strokeWidth={2} /><span className="text-xs font-bold uppercase tracking-wide">Dasbor Utama</span></Link>
          <Link to="/reports" className={navClass("/reports")}><FileText size={18} strokeWidth={2} /><span className="text-xs font-bold uppercase tracking-wide">Laporan Harian</span></Link>
          <Link to="/cameras" className={navClass("/cameras")}><Video size={18} strokeWidth={2} /><span className="text-xs font-bold uppercase tracking-wide">Kamera & CCTV</span></Link>
          <Link to="/settings" className={navClass("/settings")}><Settings size={18} strokeWidth={2} /><span className="text-xs font-bold uppercase tracking-wide">Pengaturan</span></Link>
        </nav>

        {/* TOMBOL ABOUT SYSTEM */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800/50">
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="relative flex items-center space-x-3 text-blue-600 dark:text-blue-400 bg-blue-600/5 dark:bg-blue-400/5 border border-blue-500/20 px-4 py-3 w-full transition-all rounded-xl group hover:scale-[1.02] active:scale-95"
          >
            <div className="absolute -top-1 -right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <HelpCircle size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
            <span className="font-extrabold uppercase tracking-widest text-[10px]">About System</span>
          </button>
        </div>
      </aside>

      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* NAVBAR HEADER */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/50 flex items-center justify-between px-8 py-5 flex-shrink-0 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">{getPageTitle()}</h2>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold">Operational Intelligence</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <div className="flex items-center space-x-2 text-[10px] font-bold">
                <span className="text-slate-500 dark:text-zinc-600">DB:</span>
                <span className="text-blue-600 dark:text-blue-400 uppercase">ONLINE</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold mt-1">
                <span className="text-slate-500 dark:text-zinc-600">AI:</span>
                <span className={`${isConnected ? 'text-emerald-500' : 'text-rose-500'} uppercase`}>{isConnected ? 'READY' : 'OFF'}</span>
              </div>
            </div>
            
            <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800/50"></div>

            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
              <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-blue-600 transition-all" title="Ganti Tema">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all group" title="Keluar Sistem">
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="flex items-center space-x-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-slate-900 dark:text-zinc-200 font-bold text-sm leading-none text-nowrap">Ferdi Pratama</p>
                <p className="text-slate-500 dark:text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <UserCheck size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* AREA CONTENT */}
        <div className="flex-1 overflow-y-auto pt-6 custom-scrollbar text-slate-800 dark:text-zinc-300">
          <Routes>
            <Route path="/" element={<Dashboard alerts={alerts} safetyIndex={safetyIndex} violationData={violationData} showAnalytics={showAnalytics} />} />
            <Route path="/reports" element={<Reports alerts={alerts} />} />
            <Route path="/cameras" element={<CameraManager alerts={alerts} />} />
            <Route path="/settings" element={<SettingsPage showAnalytics={showAnalytics} toggleAnalytics={toggleAnalytics} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* MODAL ABOUT SYSTEM */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setIsAboutOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#121214] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-8 text-white relative">
              <div className="absolute top-6 right-6">
                <button onClick={() => setIsAboutOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"><X size={18} /></button>
              </div>
              <Cpu size={48} className="mb-4 opacity-80" />
              <h3 className="text-2xl font-black uppercase tracking-tighter">OpsInsight AI</h3>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mt-1">v1.0.4 Enterprise MVP</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg h-max text-blue-600"><Info size={20} /></div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
                  OpsInsight AI adalah sistem berbasis AI untuk memonitor aktivitas pekerja, produktivitas, dan keselamatan secara real-time menggunakan computer vision dan dashboard interaktif.
                </p>
              </div>
              <button onClick={() => setIsAboutOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-black uppercase tracking-[0.3em] transition-all rounded-2xl shadow-lg">
                Kembali Ke Dasbor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// KOMPONEN HALAMAN PENGATURAN
// ==========================================
function SettingsPage({ showAnalytics, toggleAnalytics }) {
  return (
    <div className="px-8 pb-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-slate-900 dark:text-zinc-100 font-black tracking-widest text-xs uppercase flex items-center gap-2 mb-1">
          <Settings size={16} className="text-blue-600" /> Preferensi Antarmuka
        </h3>
        <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-[0.1em]">Kustomisasi Tampilan Dasbor Utama</p>
      </div>

      <div className="bg-white dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-zinc-800/60 p-6 shadow-sm max-w-2xl transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-widest mb-1">Modul Analitik 24 Jam</h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Tampilkan grafik Tren 24 Jam dan Pola Waktu Insiden di bawah layar kamera. 
              <br/><span className="italic">💡 Tips: Jika dimatikan, layar CCTV akan membesar memenuhi sisa ruang.</span>
            </p>
          </div>
          
          <button 
            onClick={toggleAnalytics}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#121214] ${showAnalytics ? 'bg-blue-600' : 'bg-slate-300 dark:bg-zinc-700'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${showAnalytics ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
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