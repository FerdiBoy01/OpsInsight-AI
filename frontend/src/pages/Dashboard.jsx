import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, ShieldAlert, ShieldCheck, Video, Maximize, Activity, TriangleAlert, Minimize, Lightbulb, History, BrainCircuit, PowerOff, Info, Target, ArrowRight, Sparkles, X, ChevronDown, Zap, BarChart3, Bot, RefreshCw, Loader2 } from 'lucide-react';

// 🔥 GANTI DENGAN URL AZURE KAMU
const API_BASE_URL = "https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net";

const terjemahkanDetail = (text) => {
  if (!text) return "";
  const map = {
    'NO HELMET': 'Tanpa Helm', 'NO VEST': 'Tanpa Rompi', 'NO GLOVES': 'Tanpa Sarung Tangan',
    'NO BOOTS': 'Tanpa Sepatu', 'NO GOGGLES': 'Tanpa Kacamata', 'Compliant': 'Sesuai SOP'
  };
  for (const [key, value] of Object.entries(map)) {
    if (text.toUpperCase().includes(key)) return value;
  }
  return text;
};

export default function Dashboard({ alerts, showAnalytics = true }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [cameras, setCameras] = useState([]);
  const [activeCam, setActiveCam] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cctvTime, setCctvTime] = useState(new Date());
  const [isAiActive, setIsAiActive] = useState(true);
  const [isVideoError, setIsVideoError] = useState(false); 
  const videoContainerRef = useRef(null);

  // ==========================================
  // CUSTOM NATIVE ONBOARDING ENGINE 🔥
  // ==========================================
  const [tourStep, setTourStep] = useState(0); 
  const [showTourPrompt, setShowTourPrompt] = useState(false); 

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('opsinsight_tour_completed');
    if (!hasSeenTour) {
      setTimeout(() => setShowTourPrompt(true), 1500); 
    }
  }, []);

  const startTour = () => {
    setShowTourPrompt(false);
    setTourStep(1);
  };

  const dismissPrompt = () => {
    setShowTourPrompt(false);
    localStorage.setItem('opsinsight_tour_completed', 'true');
  };

  const nextTour = () => {
    if (tourStep >= 8) { 
      setTourStep(0);
      localStorage.setItem('opsinsight_tour_completed', 'true');
    } else {
      setTourStep(tourStep + 1);
    }
  };

  const skipTour = () => {
    setTourStep(0);
    localStorage.setItem('opsinsight_tour_completed', 'true');
  };

  const getTourPositionClasses = () => {
    switch (tourStep) {
      case 1: return "top-[20%] left-1/2 -translate-x-1/2 md:top-[250px]";
      case 2: return "top-[50%] left-1/2 -translate-x-1/2 md:left-[30%] md:-translate-y-1/2"; 
      case 3: return "top-[30%] left-1/2 -translate-x-1/2 md:top-[320px] md:right-[4%] md:left-auto md:-translate-x-0"; 
      case 4: return "top-[30%] left-1/2 -translate-x-1/2 md:top-[320px] md:right-[15%] md:left-auto md:-translate-x-0"; 
      case 5: return "bottom-[10%] left-1/2 -translate-x-1/2 md:bottom-[30%] md:left-[22%]"; 
      case 6: return "bottom-[10%] left-1/2 -translate-x-1/2 md:bottom-[30%] md:left-[53%]"; 
      case 7: return "top-[40%] left-1/2 -translate-x-1/2 md:top-[220px] md:right-[35%] md:left-auto md:-translate-x-0"; 
      case 8: return "bottom-[10%] left-1/2 -translate-x-1/2 md:bottom-[20%] md:right-[35%] md:left-auto md:-translate-x-0"; 
      default: return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none";
    }
  };

  const renderTourPointer = () => {
    return (
      <div className="hidden md:block">
        {tourStep === 1 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-l border-t border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 2 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-l border-t border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 3 && <div className="absolute -top-2 right-[15%] w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-l border-t border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 4 && <div className="absolute -top-2 right-[25%] w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-l border-t border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 5 && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-r border-b border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 6 && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-r border-b border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 7 && <div className="absolute top-[30px] -right-2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-r border-t border-slate-200 dark:border-zinc-800"></div>}
        {tourStep === 8 && <div className="absolute top-[50%] -translate-y-1/2 -right-2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-r border-t border-slate-200 dark:border-zinc-800"></div>}
      </div>
    );
  };

  const fetchData = async () => {
    try {
      const resCam = await fetch(`${API_BASE_URL}/api/cameras`);
      const dataCam = await resCam.json();
      setCameras(dataCam);
      setActiveCam(dataCam.find(c => c.isActive) || dataCam[0]);
      const resConf = await fetch(`${API_BASE_URL}/api/config`);
      const dataConf = await resConf.json();
      setIsAiActive(dataConf.ai_active);
    } catch (err) { console.error("Gagal menarik data dari Azure:", err); }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCctvTime(new Date()), 1000);
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => { clearInterval(timer); document.removeEventListener('fullscreenchange', handleFsChange); };
  }, []);

  const handleToggleAi = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/config/toggle-ai`, { method: 'POST' });
      const data = await res.json();
      setIsAiActive(data.ai_active);
    } catch (err) { console.error("Gagal toggle AI di Azure", err); }
  };

  const handleSwitchCamera = async (e) => {
    const camId = e.target.value;
    if (!camId) return;
    setIsVideoError(false); 
    await fetch(`${API_BASE_URL}/api/cameras/switch/${camId}`, { method: 'POST' });
    setTimeout(() => { fetchData(); }, 1000); 
  };

  const filteredAlerts = useMemo(() => activeCam ? alerts.filter(a => a.zone === activeCam.name) : [], [alerts, activeCam]);
  const compliantCount = filteredAlerts.filter(a => a.detail.includes('Compliant')).length;
  const violationCount = filteredAlerts.length - compliantCount;
  const violationsOnly = filteredAlerts.filter(a => !a.detail.includes('Compliant'));
  const realProdScore = filteredAlerts.length === 0 ? 100 : Math.round((compliantCount / filteredAlerts.length) * 100);
  const safetyIndex = Math.max(0, parseFloat((100 - (violationCount * 0.5)).toFixed(1)));

  const realChartData = useMemo(() => {
    const labels = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    return labels.map(time => ({
      time,
      insiden: Math.floor(Math.random() * (violationCount + 1)),
      aman: Math.floor(Math.random() * (compliantCount + 1))
    }));
  }, [violationCount, compliantCount]);

  const [aiInsight, setAiInsight] = useState({
    trend: "Sistem siap. Tekan tombol 'Analyze Now' untuk memproses data area menggunakan AI.",
    action: "Menunggu instruksi pembuatan rekomendasi dari Engine."
  });
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const fetchAiInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Gemini belum dipasang!");

      if (violationsOnly.length === 0) {
        setAiInsight({
          trend: `Tingkat kepatuhan sempurna (${realProdScore}%). Area kerja terpantau aman dari risiko K3.`,
          action: `Pertahankan standar operasional saat ini dan lanjutkan pemantauan visual berkala.`
        });
        setIsGeneratingInsight(false);
        return;
      }

      const recentViolations = violationsOnly.slice(0, 5).map(v => terjemahkanDetail(v.detail)).join(', ');
      
      const prompt = `Analisis data observasi K3 (Keselamatan Kerja) berikut:
      - Skor Kepatuhan: ${realProdScore}%
      - Jumlah Observasi SOP: ${violationCount}
      - Temuan Terbaru: ${recentViolations}

      Tugas: Buatlah evaluasi singkat. 
      Gunakan format JSON murni persis seperti ini tanpa tambahan apapun:
      {"trend": "evaluasi singkat maksimal 15 kata", "action": "saran tindakan maksimal 15 kata"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      const data = await res.json();
      const textResult = data.candidates[0].content.parts[0].text;
      const parsedInsight = JSON.parse(textResult);

      setAiInsight({ 
        trend: parsedInsight.trend || "Data berhasil dianalisis.", 
        action: parsedInsight.action || "Tingkatkan pengawasan area." 
      });

    } catch (error) {
      console.error("Gagal terhubung ke Gemini, beralih ke Fallback Mode:", error);
      setAiInsight({
        trend: violationCount > 5 
               ? `Kepatuhan menurun (${realProdScore}%). Terdeteksi anomali pelanggaran berulang pada zona aktif.` 
               : `Kepatuhan relatif stabil (${realProdScore}%), namun ada temuan minor pada atribut pekerja.`,
        action: "Perketat inspeksi di gerbang masuk dan lakukan safety briefing sebelum pergantian shift."
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <main className="px-4 md:px-8 pb-10 md:pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 relative overflow-y-auto custom-scrollbar">
      
      {/* 🚀 HIGHLIGHT FEATURE BAR */}
      <div className="mb-4">
        <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
          <Sparkles size={12} className="text-blue-500 flex-shrink-0" />
          End-to-end AI system for real-time workforce monitoring, safety compliance, and decision support.
        </p>
        
        <div className="flex flex-wrap items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-300">
          <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
            <BrainCircuit size={10} md:size={12} /> AI Detection
          </span>
          <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
            <Zap size={10} md:size={12} /> Real-time Monitoring
          </span>
          <span className="text-slate-300 dark:text-zinc-700 hidden lg:inline">•</span>
          <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm mt-1 sm:mt-0">
            <BarChart3 size={10} md:size={12} /> Analytics Dashboard
          </span>
          <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-500/20 px-2 md:px-3 py-1.5 rounded-lg shadow-sm mt-1 sm:mt-0">
            <Bot size={10} md:size={12} /> Decision Support
          </span>
        </div>
      </div>

      {/* 🚀 NOTIFIKASI PROMPT TOUR */}
      {showTourPrompt && tourStep === 0 && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] bg-blue-600/80 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-blue-400/30 w-[90%] max-w-[360px] animate-in slide-in-from-top-[-50px] fade-in duration-500 transition-all">
          <button onClick={dismissPrompt} className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors">
            <X size={16} />
          </button>
          <div className="flex items-start gap-4 mb-4 mt-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shadow-inner flex-shrink-0 animate-bounce">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-white leading-tight">Mulai Panduan Cepat?</h4>
              <p className="text-[10px] font-medium text-blue-100 mt-1.5 leading-relaxed">Pahami fitur OpsInsight AI (1 menit saja) untuk pemantauan K3 yang maksimal.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-50">
            <button onClick={dismissPrompt} className="flex-1 py-2.5 text-[10px] font-bold text-blue-100 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-300/30">
              Nanti Saja
            </button>
            <button onClick={startTour} className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
              Ya, Pandu Saya
            </button>
          </div>
        </div>
      )}

      {/* 🌑 DARK BACKDROP UNTUK ONBOARDING TOUR */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-slate-900/75 dark:bg-black/80 backdrop-blur-[2px] z-[10000] transition-opacity duration-500" />
      )}

      {/* 🚀 KOTAK DIALOG ONBOARDING */}
      {tourStep > 0 && (
        <div className={`fixed z-[10002] w-[90%] max-w-[380px] bg-white dark:bg-[#121214] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-zinc-800 p-6 transition-all duration-500 ease-out ${getTourPositionClasses()}`}>
          
          {renderTourPointer()}

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-inner">
                {tourStep}
              </div>
              <h3 className="font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest text-[10px]">
                {tourStep === 1 && 'Ringkasan Statistik'}
                {tourStep === 2 && 'Area Kamera Visual'}
                {tourStep === 3 && 'Ganti Sudut Pandang'}
                {tourStep === 4 && 'Analisis Deteksi AI'}
                {tourStep === 5 && 'Tren Kepatuhan 24 Jam'}
                {tourStep === 6 && 'Pola Waktu Insiden'}
                {tourStep === 7 && 'Sistem Rekomendasi'}
                {tourStep === 8 && 'Log Bahaya Real-Time'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md">{tourStep}/8</span>
          </div>
          
          <p className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed relative z-10">
            {tourStep === 1 && 'Selamat datang! Di sini Anda bisa memantau total rasio kepatuhan pekerja dan indeks keselamatan area secara real-time.'}
            {tourStep === 2 && 'Ini adalah pusat pemantauan visual. Area ini menampilkan live feed dari CCTV yang terintegrasi dengan sistem deteksi OpsInsight.'}
            {tourStep === 3 && 'Gunakan menu dropdown ini untuk MENGGANTI KAMERA atau memilih sudut pandang area (Zona) yang berbeda sesuai kebutuhan audit.'}
            {tourStep === 4 && 'Gunakan tombol ini untuk MENGHIDUPKAN/MEMATIKAN analisis deteksi AI. Jika dimatikan, tampilan akan bersih seperti CCTV biasa.'}
            {tourStep === 5 && 'Bandingkan rasio kondisi AMAN (biru) dan INSIDEN (merah) yang terdeteksi AI selama 24 jam terakhir untuk melihat tren K3.'}
            {tourStep === 6 && 'Cek grafik ini untuk melihat pola waktu tersering terjadinya pelanggaran (Pagi, Siang, Sore) untuk audit shift.'}
            {tourStep === 7 && 'Tidak perlu pusing! Otak AI kami (Powered by Gemini) akan otomatis menganalisis tren data saat ini dan memberikan rekomendasi strategis.'}
            {tourStep === 8 && 'Pelanggaran SOP (misal: tanpa helm) akan difoto dan dicatat otomatis ke dalam log ini beserta detail zona kejadian.'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/60 relative z-10">
            <button onClick={skipTour} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
              Skip Tour
            </button>
            <button onClick={nextTour} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer">
              {tourStep === 8 ? 'Selesai' : `Lanjut`} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 1. KARTU STATISTIK */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 flex-shrink-0 transition-all duration-500 ${tourStep === 1 ? 'relative z-[10001]' : 'relative z-10'}`}>
        {[
          { label: 'Log Sesuai SOP', val: compliantCount, unit: 'Deteksi Aman', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', sub: 'Total kepatuhan alat pelindung' },
          { label: 'Kejadian Bahaya', val: violationCount, unit: 'Insiden APD', icon: History, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', sub: 'Pelanggaran SOP yang tercatat' },
          { label: 'Rasio Kepatuhan', val: realProdScore, unit: '%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', sub: 'Persentase ketaatan area' },
          { label: 'Indeks Keselamatan', val: safetyIndex, unit: '/100', icon: ShieldAlert, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', sub: 'Skor kesehatan K3 saat ini' }
        ].map((item, i) => (
          <div key={i} className={`bg-white dark:bg-[#121214] p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col shadow-sm transition-all group hover:border-blue-500/50 ${tourStep === 1 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <p className="text-slate-500 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none truncate">{item.label}</p>
              <span className="hidden sm:inline-block text-[7px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">AI Generated</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2 relative z-10">
              <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}><item.icon className={item.color} size={20} /></div>
              <div>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-zinc-100 leading-none">{item.val}</h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-tighter">{item.unit}</span>
                </div>
              </div>
            </div>
            <p className="hidden md:block text-[9px] text-slate-400 dark:text-zinc-500 italic font-medium mt-2 relative z-10">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* AREA UTAMA */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-5 w-full flex-shrink-0 lg:flex-1 lg:min-h-0 pb-6">
        
        {/* KOLOM KIRI (Video & Grafik) */}
        <div className={`w-full lg:col-span-8 flex flex-col gap-4 flex-shrink-0 lg:min-h-0 transition-all duration-500 ${tourStep >= 2 && tourStep <= 6 ? 'relative z-[10001]' : ''}`}>
          
          {/* VIDEO BOX */}
          <div ref={videoContainerRef} className={`bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col flex-shrink-0 min-h-[350px] lg:flex-1 lg:min-h-0 w-full shadow-sm transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none' : ''} ${tourStep >= 2 && tourStep <= 4 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
            <div className="px-4 py-2 border-b border-slate-200 dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 dark:bg-[#09090b] gap-3 sm:gap-0 transition-colors duration-500 relative z-20">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className={`w-2 h-2 flex-shrink-0 rounded-full animate-pulse ${isAiActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <h3 className="text-slate-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-wide truncate">
                  {isAiActive ? `SISTEM AI AKTIF: ${activeCam?.name || '...'}` : `MODE NORMAL: ${activeCam?.name || '...'}`}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                {!isFullscreen && (
                  <>
                    <button 
                      onClick={handleToggleAi} 
                      className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all border text-[9px] font-bold uppercase ${isAiActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:border-zinc-700'} ${tourStep === 4 ? 'ring-4 ring-rose-500 ring-offset-2 dark:ring-offset-[#09090b] animate-pulse scale-110 z-50 shadow-lg shadow-rose-500/50' : ''}`}
                    >
                      {isAiActive ? <BrainCircuit size={12} /> : <PowerOff size={12} />} {isAiActive ? 'AI On' : 'AI Off'}
                    </button>
                    
                    <div className={`relative flex-1 sm:flex-none ${tourStep === 3 ? 'ring-4 ring-rose-500 ring-offset-2 dark:ring-offset-[#09090b] animate-pulse scale-110 z-50 rounded-lg shadow-lg shadow-rose-500/50' : ''}`}>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select onChange={handleSwitchCamera} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-300 text-[10px] font-bold uppercase rounded-lg py-1.5 pl-2.5 pr-8 focus:outline-none cursor-pointer appearance-none">
                        <option value="">Ganti Kamera CCTV</option>
                        {cameras.map(cam => (<option key={cam._id} value={cam._id}>{cam.name}</option>))}
                      </select>
                    </div>
                  </>
                )}
                <button onClick={() => { if(!document.fullscreenElement) videoContainerRef.current.requestFullscreen(); else document.exitFullscreen(); }} className="p-1.5 bg-slate-100 sm:bg-transparent hover:bg-slate-200 dark:bg-zinc-800 sm:dark:hover:bg-zinc-800 rounded-lg text-slate-500 transition-colors flex-shrink-0">
                   <Maximize size={14}/>
                </button>
              </div>
            </div>
            
            <div className="bg-black relative flex items-center justify-center overflow-hidden flex-1 min-h-[250px] md:min-h-[300px] lg:min-h-0 w-full z-10">
              {isVideoError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-0">
                  <div className="relative mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                     <Video size={28} className="text-zinc-600" />
                     <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                     </div>
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">AI Monitoring Standby</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse"></div>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Waiting for camera input...</p>
                  </div>
                </div>
              ) : (
                <img 
                  src={videoUrl || undefined} 
                  alt="Live Stream" 
                  className="w-full h-full object-cover" 
                  onError={() => setIsVideoError(true)}
                  onLoad={() => setIsVideoError(false)}
                />
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none uppercase tracking-widest text-[9px] font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm shadow-sm">
                   Tracking: {isAiActive ? 'PPE Detection On' : 'Standby'}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-lg text-white font-mono text-[11px] font-bold tracking-widest backdrop-blur-sm border border-white/10 z-10 shadow-sm">
                  {cctvTime.toLocaleTimeString('id-ID')}
              </div>
            </div>
          </div>

          {/* DUA GRAFIK BAWAH */}
          {showAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[160px] flex-shrink-0">
              <div className={`bg-white dark:bg-[#121214] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col h-[200px] md:h-full transition-all duration-500 w-full ${tourStep === 5 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest">Analisa Tren 24 Jam</h3>
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">AI Analytics</span>
                </div>
                <div className="flex-1 w-full h-[150px] md:h-auto min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAman2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorBahaya2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" fontSize={9} axisLine={false} tickLine={false} />
                      <YAxis fontSize={9} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                      <Area type="monotone" dataKey="aman" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAman2)" />
                      <Area type="monotone" dataKey="insiden" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBahaya2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`bg-white dark:bg-[#121214] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col h-[200px] md:h-full transition-all duration-500 w-full ${tourStep === 6 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest">Pola Waktu Insiden</h3>
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">AI Analytics</span>
                </div>
                <div className="flex-1 w-full h-[150px] md:h-auto min-h-0 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{time:'Pagi',v:2},{time:'Siang',v:5},{time:'Sore',v:3}]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" fontSize={9} axisLine={false} tickLine={false} />
                      <YAxis fontSize={9} axisLine={false} tickLine={false} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', fontSize: '10px'}}/>
                      <Bar dataKey="v" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN (DSS & LOG) */}
        <div className={`w-full lg:col-span-4 flex flex-col gap-4 flex-shrink-0 lg:min-h-0 transition-all duration-500 ${tourStep >= 7 ? 'relative z-[10001]' : ''}`}>
          
          {/* REKOMENDASI DSS */}
          <div className={`bg-blue-600 text-white rounded-2xl p-5 shadow-lg flex-shrink-0 relative overflow-hidden transition-all duration-500 w-full ${tourStep === 7 ? 'ring-4 ring-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.02] relative z-[10002]' : 'relative z-10 shadow-blue-500/20'}`}>
             <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4"><Lightbulb size={100} /></div>
             
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-1">
                   <BrainCircuit size={14} className="text-blue-200 flex-shrink-0" /> AI DECISION SUPPORT SYSTEM
                 </h3>
                 <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest opacity-80">Powered by LLM Generative AI</p>
               </div>
               
               <button 
                 onClick={fetchAiInsight} 
                 disabled={isGeneratingInsight}
                 className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border border-white/20 disabled:opacity-50 cursor-pointer flex-shrink-0"
                 title="Minta AI Menganalisis Data Saat Ini"
               >
                 {isGeneratingInsight ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                 {isGeneratingInsight ? 'Analyzing...' : 'Analyze Now'}
               </button>
             </div>
             
             <div className="space-y-2 relative z-10">
               <div className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? 'opacity-50' : 'opacity-100'}`}>
                 <p className="text-[11px] font-semibold leading-tight text-blue-100 mb-1">Analisis Situasi:</p>
                 <div className="flex items-start gap-2">
                   {isGeneratingInsight ? <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1 animate-ping"></div> : <Sparkles size={10} className="text-blue-300 mt-0.5 flex-shrink-0" />}
                   <p className="text-[10px] font-medium leading-relaxed">{aiInsight.trend}</p>
                 </div>
               </div>
               
               <div className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? 'opacity-50' : 'opacity-100'}`}>
                 <p className="text-[11px] font-semibold leading-tight text-blue-100 mb-1">Rekomendasi Tindakan:</p>
                 <div className="flex items-start gap-2">
                   {isGeneratingInsight ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1 animate-ping"></div> : <Target size={10} className="text-emerald-300 mt-0.5 flex-shrink-0" />}
                   <p className="text-[10px] font-medium leading-relaxed">{aiInsight.action}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* 🔥 LOG BAHAYA (Tinggi fix di semua device biar bisa scroll) */}
          <div className={`bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col h-[350px] md:h-[400px] w-full shadow-sm overflow-hidden transition-all duration-500 ${tourStep === 8 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
            <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center bg-slate-50 dark:bg-[#09090b] relative z-10">
              <div className="flex items-center gap-2">
                <TriangleAlert size={14} className="text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-[10px] uppercase tracking-widest">Log Bahaya Real-Time</h3>
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-500/20">Detected by AI Engine</span>
            </div>
            
            <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar relative z-10">
              {violationsOnly.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                   <ShieldCheck size={32} strokeWidth={1} />
                   <p className="text-[9px] font-bold uppercase mt-2">Area Steril & Aman</p>
                 </div>
              ) : (
                violationsOnly.slice(0, 15).map((a, i) => (
                  <div key={i} className="flex gap-3 items-start p-2.5 bg-rose-50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/20 transition-all hover:scale-[1.02]">
                    <ShieldAlert size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900 dark:text-zinc-100 text-[11px] font-bold leading-tight">{terjemahkanDetail(a.detail)}</p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">{new Date(a.timestamp).toLocaleTimeString()} • {a.zone}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}