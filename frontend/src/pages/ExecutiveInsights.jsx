import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Target,
  AlertTriangle,
  MapPin,
  BrainCircuit,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";

// Data Dummy untuk grafik Mingguan (Bisa lu ganti dari API nanti)
const weeklyData = [
  { day: "Senin", insiden: 12, aman: 88 },
  { day: "Selasa", insiden: 19, aman: 81 },
  { day: "Rabu", insiden: 8, aman: 92 },
  { day: "Kamis", insiden: 24, aman: 76 },
  { day: "Jumat", insiden: 5, aman: 95 },
  { day: "Sabtu", insiden: 2, aman: 98 },
  { day: "Minggu", insiden: 0, aman: 100 },
];

export default function ExecutiveInsights() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
    // Logika export PDF bisa ditambahkan di sini nanti
  };

  return (
    <main className="px-4 md:px-8 pb-10 md:pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 overflow-y-auto custom-scrollbar">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Executive Insights
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 font-medium mt-1">
            Ringkasan performa K3 dan rekomendasi strategis berbasis AI untuk
            level Manajerial.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isExporting ? (
            <Sparkles size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          {isExporting ? "Generating PDF..." : "Export Report"}
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
          <Target
            className="absolute right-0 top-0 opacity-20 -mr-4 -mt-4"
            size={100}
          />
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">
            Safety Index Score
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black">84.5</h2>
            <span className="text-sm font-bold text-blue-200 mb-1">/100</span>
          </div>
          <p className="text-[10px] font-medium text-blue-100 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> Naik 4% dari minggu lalu
          </p>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">
            Total Pelanggaran (7 Hari)
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-rose-500">70</h2>
            <span className="text-sm font-bold text-slate-400 mb-1">
              Insiden
            </span>
          </div>
          <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
            <AlertTriangle size={12} className="text-rose-400" /> Didominasi:
            Tanpa Helm
          </p>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">
            Area Risiko Tertinggi
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-black text-amber-500 truncate">
              GUDANG MATERIAL
            </h2>
          </div>
          <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
            <MapPin size={12} className="text-amber-400" /> Menyumbang 45% total
            insiden
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* KOLOM KIRI: GRAFIK TREND MINGGUAN */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">
            Tren Kepatuhan Mingguan
          </h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="day"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    fontSize: "11px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="aman"
                  name="Aman"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="insiden"
                  name="Pelanggaran"
                  stackId="a"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KOLOM KANAN: AI EXECUTIVE REPORT */}
        <div className="bg-slate-900 dark:bg-black p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BrainCircuit className="text-blue-400" size={18} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                AI Executive Report
              </h3>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                Generated by Gemini LLM
              </p>
            </div>
          </div>

          <div className="space-y-5 relative z-10 flex-1">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert size={12} /> Analisis Situasi
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Dalam 7 hari terakhir, terjadi{" "}
                <strong className="text-rose-400">70 pelanggaran APD</strong>.
                Area <strong>Gudang Material</strong> merupakan titik risiko
                tertinggi (menyumbang 45% insiden). Kepatuhan terendah terjadi
                pada hari Kamis (76%).
              </p>
            </div>

            <div className="h-px w-full bg-slate-800"></div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Rekomendasi Tindakan
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Tingkatkan inspeksi mendadak pada pagi hari di area Gudang
                    Material.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Pasang signage peringatan wajib APD ukuran besar di akses
                    masuk area logistik.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Jadwalkan Toolbox Talk (Briefing K3) khusus membahas
                    kedisiplinan penggunaan Helm.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
            Minta Analisis Ulang AI <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
