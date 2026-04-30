import React, { useState, useMemo } from 'react';
import { 
  Download, Search, CheckCircle, Database, AlertTriangle, 
  MapPin, Image as ImageIcon, TrendingUp, Calendar, Info, ShieldAlert 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 🔥 API BASE URL UNTUK KOREKSI FOTO
const API_BASE_URL = "https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net";

const terjemahkanDetail = (text) => {
  if (!text) return "Data Kosong";
  const map = {
    'NO HELMET': 'Tanpa Helm', 'NO VEST': 'Tanpa Rompi', 'NO GLOVES': 'Tanpa Sarung Tangan',
    'NO BOOTS': 'Tanpa Sepatu', 'NO GOGGLES': 'Tanpa Kacamata', 'Compliant': 'Sesuai SOP'
  };
  for (const [key, value] of Object.entries(map)) {
    if (text.toUpperCase().includes(key)) return value;
  }
  return text;
};

// 🔥 FUNGSI KOREKSI URL FOTO (CHEAT CODE VERCEL)
const getSafeImageUrl = (rawUrl) => {
  if (!rawUrl) return null;
  if (rawUrl.includes("localhost:3000")) {
    return rawUrl.replace(/http:\/\/localhost:3000/g, API_BASE_URL);
  }
  if (rawUrl.startsWith("/uploads/")) {
    return `${API_BASE_URL}${rawUrl}`;
  }
  return rawUrl; 
};

export default function Reports({ alerts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [chartView, setChartView] = useState('DAILY');

  const availableLocations = Array.from(new Set(alerts.map(a => a.zone || 'Lokasi Belum Diatur')));

  const filteredAlerts = alerts.filter(alert => {
    const detailIndo = terjemahkanDetail(alert.detail).toLowerCase();
    const zoneIndo = (alert.zone || '').toLowerCase();
    const matchesSearch = detailIndo.includes(searchTerm.toLowerCase()) || zoneIndo.includes(searchTerm.toLowerCase());
    
    let matchesType = true;
    const isCompliant = alert.type === 'safety_compliant' || alert.detail.includes('Compliant');
    if (filterType === 'VIOLATION') matchesType = !isCompliant;
    else if (filterType === 'COMPLIANT') matchesType = isCompliant;

    let matchesDate = true;
    if (filterDate) {
      const d = new Date(alert.timestamp);
      const alertDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; 
      matchesDate = alertDateStr === filterDate;
    }

    let matchesLocation = true;
    if (filterLocation !== 'ALL') {
      matchesLocation = (alert.zone || 'Lokasi Belum Diatur') === filterLocation;
    }

    return matchesSearch && matchesType && matchesDate && matchesLocation;
  });

  const chartData = useMemo(() => {
    const baseLabels = chartView === 'DAILY' ? ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'] : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return baseLabels.map(label => ({
      name: label,
      insiden: Math.floor(Math.random() * 5),
      aman: Math.floor(Math.random() * 10) + 5
    }));
  }, [chartView]);

  const totalRekaman = filteredAlerts.length;
  const totalPelanggaran = filteredAlerts.filter(a => !a.detail.includes('Compliant')).length;
  const totalAman = totalRekaman - totalPelanggaran;

  const handleExportCSV = () => {
    if (filteredAlerts.length === 0) return alert("Data kosong!");
    let csvContent = "Tanggal,ID,Status,Detail,Lokasi,Link Foto\n";
    filteredAlerts.forEach(a => {
      const d = new Date(a.timestamp);
      const safeImageUrl = getSafeImageUrl(a.image_url) || "Tidak Ada Foto";
      csvContent += `${d.toLocaleDateString()} ${d.toLocaleTimeString()},${a._id ? a._id.slice(-6) : 'N/A'},${a.detail.includes('Compliant') ? 'AMAN' : 'BAHAYA'},"${terjemahkanDetail(a.detail)}","${a.zone}","${safeImageUrl}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_K3_${Date.now()}.csv`);
    link.click();
  };

  return (
    <main className="px-4 mt-2 md:px-8 pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 overflow-y-auto custom-scrollbar">
      
      {/* SECTION 1: GRAFIK ANALISIS (Responsif Flex) */}
      <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-800/60 rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-sm flex flex-col lg:flex-row gap-6 md:gap-8 transition-colors flex-shrink-0">
        <div className="flex-1 min-h-[200px] md:min-h-[260px]"> 
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <TrendingUp size={16} md:size={18} />
              </div>
              <div>
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-800 dark:text-zinc-200 leading-none">Tren Keamanan</h3>
                <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase mt-1">Log Aman vs Insiden</p>
              </div>
            </div>
            <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 self-end sm:self-auto">
              <button onClick={() => setChartView('DAILY')} className={`px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${chartView === 'DAILY' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-slate-500'}`}>HARIAN</button>
              <button onClick={() => setChartView('MONTHLY')} className={`px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${chartView === 'MONTHLY' ? 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600' : 'text-slate-500'}`}>BULANAN</button>
            </div>
          </div>
          
          <div className="h-[150px] md:h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" fontSize={9} md:fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" fontWeight="bold" />
                <YAxis fontSize={9} md:fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" fontWeight="bold" />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}} />
                <Area type="monotone" dataKey="aman" name="Log Aman" stroke="#3b82f6" strokeWidth={3} md:strokeWidth={4} fillOpacity={1} fill="url(#colorAman)" />
                <Area type="monotone" dataKey="insiden" name="Insiden" stroke="#f43f5e" strokeWidth={3} md:strokeWidth={4} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full lg:w-[280px]">
          {[
            { label: 'Total Database', val: totalRekaman, unit: 'Log', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/5', border: 'border-blue-100 dark:border-blue-500/20' },
            { label: 'Pelanggaran APD', val: totalPelanggaran, unit: 'Kejadian', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/5', border: 'border-rose-100 dark:border-rose-500/20' },
            { label: 'Kondisi Patuh', val: totalAman, unit: 'Validasi', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' }
          ].map((s, i) => (
            <div key={i} className={`${s.bg} ${s.border} border p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4`}>
              <div className={`p-2 md:p-2.5 bg-white dark:bg-zinc-800 rounded-xl ${s.color} shadow-sm`}><s.icon size={18}/></div>
              <div>
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 leading-none mb-1">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg md:text-xl font-black text-slate-900 dark:text-zinc-100">{s.val}</p>
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">{s.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TABEL DATA */}
      <div className="bg-white dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col shadow-sm transition-colors duration-500 flex-1 min-h-[400px]">
        
        {/* ACTION BAR DENGAN SEMUA FILTER (Responsif Penuh) */}
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-zinc-800/60 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-slate-50 dark:bg-[#09090b] gap-4 transition-colors flex-shrink-0">
          <h3 className="text-slate-900 dark:text-zinc-100 font-black tracking-widest text-[11px] md:text-xs uppercase flex items-center gap-2">
            <Calendar size={14} md:size={16} className="text-blue-600" /> Riwayat Insiden
          </h3>
          
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full xl:w-auto">
            {/* SEARCH */}
            <div className="relative col-span-2 sm:col-auto flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari Log..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 text-[10px] md:text-[11px] font-bold rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>

            {/* FILTER LOKASI */}
            <div className="relative col-span-1 sm:col-auto w-full sm:w-auto">
               <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 pl-8 pr-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
                 <option value="ALL">SEMUA LOKASI</option>
                 {availableLocations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
               </select>
            </div>

            {/* FILTER TANGGAL */}
            <input 
              type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} 
              className="w-full sm:w-auto col-span-1 sm:col-auto bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 px-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
            />

            {/* FILTER STATUS */}
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-auto col-span-1 sm:col-auto bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2 px-3 text-[10px] md:text-[11px] font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
              <option value="ALL">SEMUA STATUS</option>
              <option value="VIOLATION">PELANGGARAN</option>
              <option value="COMPLIANT">PATUH SOP</option>
            </select>

            <button onClick={handleExportCSV} className="w-full sm:w-auto col-span-1 sm:col-auto flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] md:text-[11px] font-black tracking-widest shadow-md active:scale-95 transition-all">
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {/* TABEL AREA (Dibungkus overflow-x-auto biar bisa di-scroll samping di HP) */}
        <div className="overflow-x-auto w-full flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#121214] transition-colors border-b border-slate-200 dark:border-zinc-800">
              <tr className="text-slate-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-4 md:px-6 py-3">Waktu Terdeteksi</th>
                <th className="px-4 md:px-6 py-3">ID Kejadian</th>
                <th className="px-4 md:px-6 py-3">Analisis Objek AI</th>
                <th className="px-4 md:px-6 py-3">Titik Lokasi</th>
                <th className="px-4 md:px-6 py-3 text-center">Visual Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
              {filteredAlerts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest italic">Data tidak ditemukan</td></tr>
              ) : (
                filteredAlerts.map((alert, idx) => {
                  const d = new Date(alert.timestamp);
                  const isCompliant = alert.type === 'safety_compliant' || alert.detail.includes('Compliant');
                  
                  const finalImageUrl = getSafeImageUrl(alert.image_url);

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-4 md:px-6 py-2 md:py-2.5 whitespace-nowrap">
                        <div className="text-slate-900 dark:text-zinc-200 text-[10px] md:text-[11px] font-black tracking-tight">{d.toLocaleTimeString('id-ID')}</div>
                        <div className="text-slate-400 dark:text-zinc-500 text-[9px] md:text-[10px] font-bold mt-0.5">{d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</div>
                      </td>
                      <td className="px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] text-slate-400 dark:text-zinc-600 font-mono font-bold">#{alert._id ? alert._id.slice(-6).toUpperCase() : 'SIM-OK'}</td>
                      <td className="px-4 md:px-6 py-2 md:py-2.5">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border w-max ${isCompliant ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600'}`}>
                          {isCompliant ? <CheckCircle size={10} md:size={12} /> : <ShieldAlert size={10} md:size={12} />}
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">{terjemahkanDetail(alert.detail)}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] text-slate-600 dark:text-zinc-400 font-bold whitespace-nowrap">
                        <div className="flex items-center gap-1.5"><MapPin size={10} className="text-blue-500"/> {alert.zone}</div>
                      </td>
                      <td className="px-4 md:px-6 py-2 md:py-2.5">
                        <div className="flex justify-center">
                          {finalImageUrl ? (
                            <a href={finalImageUrl} target="_blank" rel="noreferrer" className="w-10 h-7 md:w-12 md:h-8 bg-slate-200 dark:bg-zinc-900 rounded-lg border border-slate-300 dark:border-zinc-700 overflow-hidden block relative group/img transition-all hover:ring-2 hover:ring-blue-500">
                                <img src={finalImageUrl} alt="Evidence" loading="lazy" className="w-full h-full object-cover grayscale-[0.3] group-hover:img:grayscale-0 transition-all" />
                            </a>
                          ) : <div className="text-[8px] md:text-[9px] text-slate-300 dark:text-zinc-700 font-black italic">NO IMAGE</div>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER TABEL */}
        <div className="px-4 md:px-6 py-3 bg-slate-50 dark:bg-[#09090b] border-t border-slate-200 dark:border-zinc-800/60 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-600">
            <Info size={12} />
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none hidden sm:block">Auto-sync MongoDB Active</p>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none sm:hidden">Auto-sync Active</p>
          </div>
          <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-zinc-500 font-mono font-black uppercase tracking-widest leading-none">Total: {filteredAlerts.length} Entri</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}} />
    </main>
  );
}