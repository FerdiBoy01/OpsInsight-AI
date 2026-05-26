import React, { useState, useEffect, useMemo } from "react";
import {
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
  Loader2,
  BarChart3,
} from "lucide-react";

export default function ExecutiveInsights({ alerts = [] }) {
  const [isExporting, setIsExporting] = useState(false);

  // ==========================================
  // 🔥 MESIN PENGOLAH DATA REAL-TIME 🔥
  // ==========================================
  const stats = useMemo(() => {
    // 1. Pisahkan mana yang aman dan pelanggaran
    const violationsOnly = alerts.filter(
      (a) => !a.detail.includes("Compliant"),
    );
    const compliantOnly = alerts.filter((a) => a.detail.includes("Compliant"));

    // 2. Hitung Total
    const totalViolations = violationsOnly.length;
    const realSafetyIndex =
      alerts.length === 0
        ? 100
        : Math.max(0, parseFloat((100 - totalViolations * 0.5).toFixed(1)));

    // 3. Cari Area Paling Bahaya
    const zoneCounts = {};
    violationsOnly.forEach((a) => {
      zoneCounts[a.zone] = (zoneCounts[a.zone] || 0) + 1;
    });

    let worstZone = "Belum Ada Data";
    let maxCount = 0;
    for (const [zone, count] of Object.entries(zoneCounts)) {
      if (count > maxCount) {
        maxCount = count;
        worstZone = zone;
      }
    }
    const persentaseRisiko =
      totalViolations > 0 ? Math.round((maxCount / totalViolations) * 100) : 0;

    // 4. Olah Data untuk Grafik 7 Hari
    const daysMap = {
      0: "Minggu",
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat",
      6: "Sabtu",
    };
    const weekData = [
      { day: "Senin", insiden: 0, aman: 0 },
      { day: "Selasa", insiden: 0, aman: 0 },
      { day: "Rabu", insiden: 0, aman: 0 },
      { day: "Kamis", insiden: 0, aman: 0 },
      { day: "Jumat", insiden: 0, aman: 0 },
      { day: "Sabtu", insiden: 0, aman: 0 },
      { day: "Minggu", insiden: 0, aman: 0 },
    ];

    alerts.forEach((a) => {
      const date = new Date(a.timestamp);
      const dayName = daysMap[date.getDay()];
      const dayObj = weekData.find((d) => d.day === dayName);
      if (dayObj) {
        if (a.detail.includes("Compliant")) dayObj.aman += 1;
        else dayObj.insiden += 1;
      }
    });

    return {
      totalPelanggaran: totalViolations,
      safetyIndex: realSafetyIndex,
      areaRisiko: worstZone,
      persentaseRisiko: persentaseRisiko,
      chartData: weekData,
      rawViolations: violationsOnly,
    };
  }, [alerts]);

  // ==========================================
  // 🔥 AI GENERATIVE ENGINE (GEMINI) 🔥
  // ==========================================
  const [aiInsight, setAiInsight] = useState({
    ringkasan:
      "Laporan belum di-generate. Tekan tombol 'Minta Analisis Ulang AI' untuk memproses data KPI K3 saat ini menggunakan Large Language Model.",
    rekomendasi: [],
  });
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const fetchAiInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Gemini belum dipasang!");

      if (stats.totalPelanggaran === 0) {
        setAiInsight({
          ringkasan: `Dalam 7 hari terakhir, skor kepatuhan sempurna. Area kerja terpantau sangat aman tanpa ada insiden pelanggaran APD yang tercatat di sistem.`,
          rekomendasi: [
            "Berikan apresiasi (reward) kepada tim lapangan atas disiplin K3.",
            "Pertahankan standar inspeksi harian saat ini.",
          ],
        });
        setIsGeneratingInsight(false);
        return;
      }

      // Ambil 5 sampel pelanggaran terbaru buat dikirim ke AI
      const recentIssues = stats.rawViolations
        .slice(0, 5)
        .map((v) => v.detail.replace(" Detected", ""))
        .join(", ");

      const prompt = `Anda adalah Direktur Keselamatan Kerja (HSE Director) di sebuah perusahaan industri.
      Tugas Anda adalah merangkum data laporan K3 mingguan berikut untuk rapat eksekutif (Board Meeting).
      
      DATA AKTUAL DARI SISTEM:
      - Safety Index: ${stats.safetyIndex}/100
      - Total Pelanggaran APD 7 Hari: ${stats.totalPelanggaran} insiden
      - Area Risiko Tertinggi: ${stats.areaRisiko} (Menyumbang ${stats.persentaseRisiko}% dari total insiden)
      - Sampel Pelanggaran Terbanyak: ${recentIssues}

      OUTPUT YANG DIINGINKAN:
      Buatlah evaluasi profesional dan spesifik.
      WAJIB GUNAKAN FORMAT JSON MURNI BERIKUT (Tanpa blok kode markdown):
      {
        "ringkasan": "Tulis 2 kalimat ringkasan eksekutif bernada tegas, sebutkan nama area risiko dan angka pelanggaran.",
        "rekomendasi": [
          "Strategi mitigasi 1 (maksimal 10 kata)",
          "Strategi mitigasi 2 (maksimal 10 kata)",
          "Strategi mitigasi 3 (maksimal 10 kata)"
        ]
      }`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      if (!res.ok) throw new Error(`API Error ${res.status}`);

      const data = await res.json();
      let textResult = data.candidates[0].content.parts[0].text;

      // Bersihkan kalau Gemini bandel ngasih backticks markdown
      textResult = textResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsedInsight = JSON.parse(textResult);

      setAiInsight({
        ringkasan: parsedInsight.ringkasan,
        rekomendasi: parsedInsight.rekomendasi,
      });
    } catch (error) {
      console.error("Gagal terhubung ke Gemini:", error);
      setAiInsight({
        ringkasan: `Terjadi penurunan Safety Index menjadi ${stats.safetyIndex}. Area ${stats.areaRisiko} mendominasi dengan ${stats.persentaseRisiko}% pelanggaran dari total ${stats.totalPelanggaran} insiden APD.`,
        rekomendasi: [
          `Lakukan inspeksi mendadak di area ${stats.areaRisiko}.`,
          "Perketat sanksi administratif bagi pelanggar APD.",
          "Jadwalkan Safety Briefing besok pagi.",
        ],
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <main className="px-4 md:px-8 pb-10 md:pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
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
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          {isExporting ? "Generating PDF..." : "Export Report"}
        </button>
      </div>

      {/* KPI CARDS (DARI DATA ASLI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group">
          <Target
            className="absolute right-0 top-0 opacity-20 -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110"
            size={100}
          />
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1 relative z-10">
            Safety Index Score
          </p>
          <div className="flex items-end gap-2 relative z-10">
            <h2 className="text-4xl font-black">{stats.safetyIndex}</h2>
            <span className="text-sm font-bold text-blue-200 mb-1">/100</span>
          </div>
          <p className="text-[10px] font-medium text-blue-100 mt-2 flex items-center gap-1 relative z-10">
            <TrendingUp size={12} /> Diperbarui secara Real-time
          </p>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center transition-colors">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">
            Total Pelanggaran (7 Hari)
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-rose-500">
              {stats.totalPelanggaran}
            </h2>
            <span className="text-sm font-bold text-slate-400 mb-1">
              Insiden
            </span>
          </div>
          <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
            <AlertTriangle
              size={12}
              className={
                stats.totalPelanggaran > 0
                  ? "text-rose-400"
                  : "text-emerald-400"
              }
            />
            {stats.totalPelanggaran > 0
              ? "Butuh Perhatian Khusus"
              : "Area Kondusif"}
          </p>
        </div>

        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center transition-colors">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">
            Area Risiko Tertinggi
          </p>
          <div className="flex items-end gap-2">
            <h2
              className="text-xl md:text-2xl font-black text-amber-500 truncate"
              title={stats.areaRisiko}
            >
              {stats.areaRisiko.length > 15
                ? stats.areaRisiko.substring(0, 15) + "..."
                : stats.areaRisiko}
            </h2>
          </div>
          <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
            <MapPin size={12} className="text-amber-400" /> Menyumbang{" "}
            {stats.persentaseRisiko}% total insiden
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* KOLOM KIRI: GRAFIK TREND MINGGUAN ASLI */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col min-h-[300px] lg:min-h-0">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">
            Tren Kepatuhan Mingguan
          </h3>
          <div className="flex-1 w-full relative">
            {alerts.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <BarChart3 size={32} className="opacity-20 mb-2" />
                <p className="text-[10px] uppercase tracking-widest font-bold">
                  Belum Ada Data Dihimpun
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.chartData}
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
                    name="Sesuai SOP (Aman)"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="insiden"
                    name="Pelanggaran (Bahaya)"
                    stackId="a"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: AI EXECUTIVE REPORT */}
        <div className="bg-slate-900 dark:bg-black p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col min-h-[350px] lg:min-h-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BrainCircuit className="text-blue-400" size={18} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
                AI Executive Report
              </h3>
              <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">
                Generated by Gemini LLM
              </p>
            </div>
          </div>

          <div className="space-y-5 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div
              className={`transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
            >
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert size={12} /> Analisis Situasi
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium text-justify">
                {aiInsight.ringkasan}
              </p>
            </div>

            <div className="h-px w-full bg-slate-800/80"></div>

            <div
              className={`transition-opacity duration-300 ${isGeneratingInsight ? "opacity-50" : "opacity-100"}`}
            >
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Rekomendasi Tindakan
              </h4>

              {aiInsight.rekomendasi.length > 0 ? (
                <ul className="space-y-3">
                  {aiInsight.rekomendasi.map((rek, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        {rek}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[10px] text-slate-500 italic">
                  Belum ada rekomendasi. Silakan proses data.
                </p>
              )}
            </div>
          </div>

          {/* TOMBOL TRIGGER AI */}
          <button
            onClick={fetchAiInsight}
            disabled={isGeneratingInsight}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 z-10 relative cursor-pointer"
          >
            {isGeneratingInsight ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <BrainCircuit size={14} />
            )}
            {isGeneratingInsight
              ? "AI Sedang Menganalisis..."
              : "Minta Analisis Ulang AI"}{" "}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
