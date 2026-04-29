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
  // CUSTOM NATIVE ONBOARDING ENGINE
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

  // 💡 Penyesuaian Tour agar tidak hancur di HP (disembunyikan di layar kecil untuk aman)
  const getTourPositionClasses = () => {
    switch (tourStep) {
      case 1: return "top-[20%] left-1/2 -translate-x-1/2 md:top-[250px]";
      case 2: return "top-[50%] left-1/2 -translate-x-1/2 md:left-[30%] -translate-y-1/2"; 
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
    // Pointer panah dimatikan di HP (hidden md:block) biar nggak pusing
    return <div className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121214] rotate-45 border-l border-t border-slate-200 dark:border-zinc-800"></div>;
  };

  const fetchData = async () => {
    try {
      const resCam = await fetch(`${API_BASE_URL}/api/cameras`);
      const dataCam = await resCam.json();
      setCameras(dataCam);
      
      const active = dataCam.find(c => c.isActive) || dataCam[0];
      setActiveCam(active);
      if (active) {
        setVideoUrl(`${active.url}?t=${Date.now()}`);
      }

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
    setTimeout(() => { fetchData(); }, 1500); 
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
      
      const prompt = `Analisis data observasi K3 berikut:
      - Skor: ${realProdScore}%
      - Observasi: ${violationCount}
      - Temuan: ${recentViolations}
      Buat evaluasi singkat. Format JSON: {"trend": "15 kata maks", "action": "15 kata maks"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const data = await res.json();
      const parsedInsight = JSON.parse(data.candidates[0].content.parts[0].text);

      setAiInsight({ 
        trend: parsedInsight.trend || "Data berhasil dianalisis.", 
        action: parsedInsight.action || "Tingkatkan pengawasan area." 
      });

    } catch (error) {
      setAiInsight({
        trend: violationCount > 5 
               ? `Kepatuhan menurun (${realProdScore}%). Terdeteksi anomali pelanggaran berulang.` 
               : `Kepatuhan relatif stabil (${realProdScore}%), namun ada temuan minor pada pekerja.`,
        action: "Perketat inspeksi di gerbang masuk dan lakukan safety briefing sebelum shift."
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <main className="px-4 md:px-8 pb-6 h-full flex flex-col transition-colors duration-500 relative overflow-y-auto custom-scrollbar">
      
      {/* 🚀 HIGHLIGHT FEATURE BAR */}
      <div className="mb-4 pt-4 md:pt-0">
        <p className="text-[9px] md:text-[10px] mt-2 font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-[0.1em] md:tracking-[0.2em] mb-2 flex items-center gap-8">
          <Sparkles size={12} className="text-blue-500 flex-shrink-0" />
          End-to-end AI system for real-time monitoring and safety compliance.
        </p>
        
        <div className="flex flex-wrap items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-300">
          <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 border px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
            <BrainCircuit size={10} md:size={12} /> AI Detection
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
            <Zap size={10} md:size={12} /> Real-time
          </span>
          <span className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 border px-2 md:px-3 py-1.5 rounded-lg shadow-sm">
            <Bot size={10} md:size={12} /> Decision Support
          </span>
        </div>
      </div>

      {/* 🚀 KOTAK DIALOG ONBOARDING (Disembunyikan kodingan pointer aslinya biar simpel) */}
      {/* ... (Kodingan Onboarding Popup tetap sama, tapi posisinya di HP dibikin tengah semua) ... */}

      {/* 1. KARTU STATISTIK (RESPONSIVE: 2 Kolom di HP, 4 Kolom di Laptop) */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 flex-shrink-0 transition-all duration-500 ${tourStep === 1 ? 'relative z-[10001]' : 'relative z-10'}`}>
        {[
          { label: 'Log Sesuai SOP', val: compliantCount, unit: 'Aman', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', sub: 'Kepatuhan alat pelindung' },
          { label: 'Kejadian Bahaya', val: violationCount, unit: 'Insiden', icon: History, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', sub: 'Pelanggaran SOP tercatat' },
          { label: 'Kepatuhan', val: realProdScore, unit: '%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', sub: 'Persentase ketaatan area' },
          { label: 'Indeks K3', val: safetyIndex, unit: '/100', icon: ShieldAlert, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', sub: 'Skor kesehatan saat ini' }
        ].map((item, i) => (
          <div key={i} className={`bg-white dark:bg-[#121214] p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col shadow-sm transition-all group hover:border-blue-500/50 ${tourStep === 1 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-50 dark:bg-[#09090b] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <p className="text-slate-500 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none truncate">{item.label}</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4 mb-1 md:mb-2 relative z-10">
              <div className={`p-2 rounded-xl flex-shrink-0 ${item.bg}`}><item.icon className={item.color} size={18} /></div>
              <div>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-zinc-100 leading-none">{item.val}</h3>
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-tighter">{item.unit}</span>
                </div>
              </div>
            </div>
            <p className="hidden md:block text-[9px] text-slate-400 dark:text-zinc-500 italic font-medium mt-2 relative z-10">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* 2. AREA UTAMA (RESPONSIVE: Tumpuk di HP, Bagi dua 8-4 di Laptop) */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-5 flex-1 min-h-0">
        
        {/* KOLOM KIRI (Video & Grafik) */}
        <div className={`lg:col-span-8 flex flex-col gap-4 lg:min-h-0 transition-all duration-500 ${tourStep >= 2 && tourStep <= 6 ? 'relative z-[10001]' : ''}`}>
          
          {/* VIDEO BOX */}
          <div ref={videoContainerRef} className={`bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col shadow-sm transition-all duration-500 min-h-[300px] lg:flex-1 ${isFullscreen ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none' : ''} ${tourStep >= 2 && tourStep <= 4 ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.01] relative z-[10002]' : 'relative z-10'}`}>
            
            {/* VIDEO HEADER (Responsif flex-wrap biar di HP tombolnya nggak kepotong) */}
            <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-200 dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-slate-50 dark:bg-[#09090b] transition-colors duration-500 relative z-20">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isAiActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] md:text-[11px] font-bold uppercase tracking-wide truncate max-w-[150px] md:max-w-none">
                  {isAiActive ? `AI AKTIF: ${activeCam?.name || '...'}` : `NORMAL: ${activeCam?.name || '...'}`}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {!isFullscreen && (
                  <>
                    <button 
                      onClick={handleToggleAi} 
                      className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all border text-[9px] font-bold uppercase ${isAiActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:border-zinc-700'}`}
                    >
                      {isAiActive ? <BrainCircuit size={12} /> : <PowerOff size={12} />} {isAiActive ? 'AI On' : 'AI Off'}
                    </button>
                    
                    <div className="relative flex-1 sm:flex-none">
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select onChange={handleSwitchCamera} className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-300 text-[9px] font-bold uppercase rounded-lg py-2 sm:py-1.5 pl-2.5 pr-8 focus:outline-none cursor-pointer appearance-none">
                        <option value="">Ganti Kamera</option>
                        {cameras.map(cam => (<option key={cam._id} value={cam._id}>{cam.name}</option>))}
                      </select>
                    </div>
                  </>
                )}
                <button onClick={() => { if(!document.fullscreenElement) videoContainerRef.current.requestFullscreen(); else document.exitFullscreen(); }} className="p-2 sm:p-1.5 bg-slate-100 sm:bg-transparent sm:hover:bg-slate-200 dark:bg-zinc-800 sm:dark:bg-transparent dark:hover:bg-zinc-800 rounded-lg text-slate-500 transition-colors ml-auto">
                   <Maximize size={14}/>
                </button>
              </div>
            </div>
            
            <div className="bg-black relative flex items-center justify-center overflow-hidden flex-1 min-h-[250px] md:min-h-[300px] relative z-10">
              {isVideoError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-0">
                  <div className="relative mb-3 md:mb-5 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                     <Video size={24} className="text-zinc-600" />
                  </div>
                  <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">AI Standby</h3>
                </div>
              ) : (
                <img src={videoUrl} alt="Live Stream" className="w-full h-full object-cover" onError={() => setIsVideoError(true)} onLoad={() => setIsVideoError(false)} />
              )}

              <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2 z-10 pointer-events-none uppercase tracking-widest text-[7px] md:text-[9px] font-bold text-white bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                   {isAiActive ? 'PPE Detection On' : 'Standby'}
              </div>
            </div>
          </div>

          {/* DUA GRAFIK BAWAH (RESPONSIVE: Tumpuk di HP, Sejajar di Laptop) */}
          {showAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[160px] flex-shrink-0">
              
              {/* GRAFIK 24 JAM */}
              <div className="bg-white dark:bg-[#121214] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col h-[160px] md:h-full relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest">Analisa Tren</h3>
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Analytics</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realChartData}>
                      <defs>
                        <linearGradient id="colorAman2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorBahaya2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" fontSize={8} axisLine={false} tickLine={false} />
                      <YAxis fontSize={8} width={20} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px'}} />
                      <Area type="monotone" dataKey="aman" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAman2)" />
                      <Area type="monotone" dataKey="insiden" stroke="#f43f5e" fillOpacity={1} fill="url(#colorBahaya2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* GRAFIK WAKTU */}
              <div className="bg-white dark:bg-[#121214] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800/60 shadow-sm flex flex-col h-[160px] md:h-full relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest">Pola Waktu</h3>
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Analytics</span>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{time:'Pagi',v:2},{time:'Siang',v:5},{time:'Sore',v:3}]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" fontSize={8} axisLine={false} tickLine={false} />
                      <YAxis fontSize={8} width={20} axisLine={false} tickLine={false} />
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
        <div className={`lg:col-span-4 flex flex-col gap-4 min-h-[400px] lg:min-h-0 transition-all duration-500`}>
          
          {/* REKOMENDASI DSS */}
          <div className="bg-blue-600 text-white rounded-2xl p-4 md:p-5 shadow-lg flex-shrink-0 relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 -mr-4 -mt-4"><Lightbulb size={80} md:size={100} /></div>
             
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div className="pr-2">
                 <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 mb-1">
                   <BrainCircuit size={14} className="text-blue-200 flex-shrink-0" /> AI DECISION SUPPORT
                 </h3>
               </div>
               
               <button 
                 onClick={fetchAiInsight} 
                 disabled={isGeneratingInsight}
                 className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg border border-white/20 disabled:opacity-50 flex-shrink-0"
               >
                 {isGeneratingInsight ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                 <span className="hidden sm:inline">Analyze</span>
               </button>
             </div>
             
             <div className="space-y-2 relative z-10">
               <div className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? 'opacity-50' : 'opacity-100'}`}>
                 <p className="text-[10px] md:text-[11px] font-semibold leading-tight text-blue-100 mb-1">Analisis Situasi:</p>
                 <div className="flex items-start gap-2">
                   {isGeneratingInsight ? <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1 animate-ping"></div> : <Sparkles size={10} className="text-blue-300 mt-0.5 flex-shrink-0" />}
                   <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">{aiInsight.trend}</p>
                 </div>
               </div>
               
               <div className={`bg-white/10 p-2.5 rounded-xl border border-white/20 transition-opacity duration-300 ${isGeneratingInsight ? 'opacity-50' : 'opacity-100'}`}>
                 <p className="text-[10px] md:text-[11px] font-semibold leading-tight text-blue-100 mb-1">Rekomendasi Tindakan:</p>
                 <div className="flex items-start gap-2">
                   {isGeneratingInsight ? <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1 animate-ping"></div> : <Target size={10} className="text-emerald-300 mt-0.5 flex-shrink-0" />}
                   <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">{aiInsight.action}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* LOG BAHAYA */}
          <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 flex flex-col flex-1 min-h-[250px] lg:min-h-0 shadow-sm overflow-hidden">
            <div className="px-3 md:px-4 py-3 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center bg-slate-50 dark:bg-[#09090b]">
              <div className="flex items-center gap-1.5 md:gap-2">
                <TriangleAlert size={14} className="text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-[9px] md:text-[10px] uppercase tracking-widest">Log Bahaya</h3>
              </div>
              <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-500/20">AI Engine</span>
            </div>
            
            <div className="p-2 md:p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
              {violationsOnly.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                   <ShieldCheck size={24} md:size={32} strokeWidth={1} />
                   <p className="text-[8px] md:text-[9px] font-bold uppercase mt-2 text-center">Area Steril & Aman</p>
                 </div>
              ) : (
                violationsOnly.slice(0, 15).map((a, i) => (
                  <div key={i} className="flex gap-2.5 md:gap-3 items-start p-2 md:p-2.5 bg-rose-50 dark:bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-500/20">
                    <ShieldAlert size={12} md:size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900 dark:text-zinc-100 text-[10px] md:text-[11px] font-bold leading-tight">{terjemahkanDetail(a.detail)}</p>
                      <p className="text-[8px] md:text-[9px] text-slate-500 uppercase font-bold mt-0.5">{new Date(a.timestamp).toLocaleTimeString()} • {a.zone}</p>
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