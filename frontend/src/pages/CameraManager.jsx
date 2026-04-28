import React, { useState, useEffect } from 'react';
import { Video, Plus, PlayCircle, CheckCircle2, Trash2, MonitorPlay, Save } from 'lucide-react';

// 🔥 API BASE URL MENGGUNAKAN DOMAIN AZURE BARU KAMU
const API_BASE_URL = "https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net";

export default function CameraManager() {
  const [cameras, setCameras] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  // 🔥 State awal dikosongkan, biar otomatis diisi oleh fetchCameras
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchCameras = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cameras`);
      const data = await response.json();
      setCameras(data);
      
      // ✅ BACA LINK OTOMATIS DARI KAMERA YANG AKTIF DI DATABASE
      const active = data.find(c => c.isActive);
      if (active) {
        setPreviewUrl(`${active.url}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Gagal load kamera:", error);
    }
  };

  useEffect(() => { fetchCameras(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newUrl) return alert("Nama dan URL harus diisi!");
    
    try {
      await fetch(`${API_BASE_URL}/api/cameras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, url: newUrl })
      });
      setNewName('');
      setNewUrl('');
      fetchCameras();
    } catch (err) {
      console.error("Gagal menambah kamera:", err);
      alert("Terjadi kesalahan saat menyimpan kamera.");
    }
  };

  const handleSwitch = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/cameras/switch/${id}`, { method: 'POST' });
      // ✅ Cukup panggil fetchCameras, karena logic ubah URL preview udah ada di dalamnya
      fetchCameras();
    } catch (err) {
      console.error("Gagal mengganti kamera:", err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Peringatan: Menghapus kamera ini mungkin akan memutus tautan dengan data riwayat. Lanjutkan?")) {
      try {
        await fetch(`${API_BASE_URL}/api/cameras/${id}`, { method: 'DELETE' });
        fetchCameras();
      } catch (err) {
        console.error("Gagal menghapus kamera:", err);
      }
    }
  };

  const activeCam = cameras.find(c => c.isActive);

  return (
    <main className="px-8 pb-6 h-full flex flex-col transition-colors duration-500">
      <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col flex-1 shadow-sm transition-colors duration-500">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-[#09090b] flex justify-between items-center transition-colors duration-500 flex-shrink-0">
          <div>
            <h3 className="text-slate-900 dark:text-zinc-100 font-extrabold tracking-wide text-lg flex items-center gap-2 uppercase">
              <Video size={20} className="text-blue-600 dark:text-blue-500" /> Konfigurasi Kamera & IoT
            </h3>
            <p className="text-slate-500 dark:text-zinc-500 text-[11px] mt-1.5 font-medium">Manajemen sumber video CCTV dan aliran IP Camera (RTSP) untuk Mesin AI</p>
          </div>
        </div>

        <div className="p-6 flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          
          {/* KOLOM KIRI: FORM & LIST KAMERA */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6 min-h-0">
            
            {/* Form Tambah Kamera */}
            <div className="bg-slate-50 dark:bg-[#09090b] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/60 shadow-inner flex-shrink-0 transition-colors duration-500">
              <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} className="text-blue-600 dark:text-blue-400"/> Tambah Sumber Baru
              </h4>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Nama Lokasi / Zona</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      required 
                      placeholder="Misal: GUDANG UTAMA" 
                      className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">URL Stream (RTSP/MP4)</label>
                    <input 
                      type="text" 
                      value={newUrl} 
                      onChange={(e) => setNewUrl(e.target.value)} 
                      required 
                      placeholder="simulasi.mp4 atau rtsp://..." 
                      className="w-full bg-white dark:bg-[#121214] border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  <Save size={16} /> SIMPAN KONFIGURASI
                </button>
              </form>
            </div>

            {/* List Kamera Tersedia */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-3 uppercase tracking-widest">Daftar Kamera Tersedia</h4>
              <div className="space-y-2.5 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {cameras.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-300 dark:border-zinc-700/50 rounded-2xl bg-slate-50 dark:bg-[#09090b] transition-colors duration-500">
                    <Video size={32} className="mx-auto text-slate-300 dark:text-zinc-600 mb-3" />
                    <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Belum ada kamera</p>
                  </div>
                ) : (
                  cameras.map((cam) => (
                    <div 
                      key={cam._id} 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        cam.isActive 
                          ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 shadow-sm' 
                          : 'bg-white dark:bg-[#09090b] border-slate-200 dark:border-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h5 className="text-slate-900 dark:text-zinc-200 font-bold text-xs flex items-center gap-2 truncate">
                          {cam.name} 
                          {cam.isActive && (
                            <span className="flex items-center gap-1 text-[9px] uppercase font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                              <CheckCircle2 size={12} strokeWidth={2.5}/> AKTIF
                            </span>
                          )}
                        </h5>
                        <p className="text-slate-500 dark:text-zinc-500 text-[10px] mt-1.5 font-mono truncate">{cam.url}</p>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        {!cam.isActive && (
                          <button 
                            onClick={() => handleSwitch(cam._id)} 
                            title="Ganti ke Kamera ini" 
                            className="p-2 bg-slate-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-slate-400 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 rounded-lg transition-all border border-slate-200 dark:border-zinc-700 shadow-sm"
                          >
                            <PlayCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(cam._id)} 
                          title="Hapus Kamera" 
                          className="p-2 bg-slate-50 dark:bg-zinc-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 rounded-lg transition-all border border-slate-200 dark:border-zinc-700 shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: LIVE PREVIEW */}
          <div className="w-full lg:w-7/12 flex flex-col min-h-0">
             <h4 className="text-slate-900 dark:text-zinc-100 text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
               <MonitorPlay size={16} className="text-blue-600 dark:text-blue-400"/> Pratinjau Sistem Aktual
             </h4>
             
             <div className="flex-1 bg-[#09090b] rounded-2xl border border-slate-300 dark:border-zinc-700/80 overflow-hidden relative shadow-inner ring-1 ring-black/5 dark:ring-white/5">
               {/* OSD Bintang Kiri Atas */}
               <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                 <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 rounded-lg text-white text-[9px] font-bold tracking-widest backdrop-blur-sm border border-white/10 w-max shadow-sm">
                   <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></span> RAW FEED
                 </div>
               </div>
               
               {/* OSD Kanan Bawah */}
               <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                 <div className="bg-black/60 px-3 py-1.5 rounded-lg text-white font-mono text-[10px] uppercase tracking-widest backdrop-blur-sm border border-white/10 shadow-sm font-bold">
                   {activeCam?.name || 'OFFLINE'}
                 </div>
               </div>

               <img 
                 src={previewUrl} 
                 alt="Preview" 
                 className="w-full h-full object-cover" 
                 onError={(e) => { 
                   e.target.onerror = null; 
                   e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='100%25' height='100%25' fill='%2309090b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2352525b' letter-spacing='2'%3ESTREAM OFFLINE / MENYINKRONKAN%3C/text%3E%3C/svg%3E"; 
                 }} 
               />
             </div>
             
             {/* Info Box */}
             <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl flex-shrink-0 transition-colors duration-500">
               <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed text-justify font-medium">
                 Pratinjau di atas menampilkan aliran video mentah yang sedang dianalisis AI.
                 Saat Anda mengganti kamera aktif, AI membutuhkan jeda <strong className="text-slate-900 dark:text-zinc-200 font-bold">~3 detik</strong> untuk melakukan kalibrasi RTSP.
               </p>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}