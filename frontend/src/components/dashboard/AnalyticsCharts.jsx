// src/components/dashboard/AnalyticsCharts.jsx
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsCharts({
  violationCount,
  compliantCount,
  violationsOnly, // Menerima data dari Dashboard
  tourStep,
}) {
  // Simulasi tren 24 jam
  const realChartData = useMemo(() => {
    const labels = ["08:00", "10:00", "12:00", "14:00", "16:00"];
    return labels.map((time) => ({
      time,
      insiden: Math.floor(Math.random() * (violationCount + 1)),
      aman: Math.floor(Math.random() * (compliantCount + 1)),
    }));
  }, [violationCount, compliantCount]);

  // 🔥 MENGHITUNG POLA WAKTU SECARA DINAMIS DARI DATA ASLI
  const timePatternData = useMemo(() => {
    if (!violationsOnly || violationsOnly.length === 0) {
      return [
        { time: "Pagi", v: 0 },
        { time: "Siang", v: 0 },
        { time: "Sore", v: 0 },
      ];
    }

    let pagi = 0; // 06:00 - 11:59
    let siang = 0; // 12:00 - 15:59
    let sore = 0; // 16:00 - 23:59

    violationsOnly.forEach((v) => {
      const hour = new Date(v.timestamp).getHours();
      if (hour >= 6 && hour < 12) pagi++;
      else if (hour >= 12 && hour < 16) siang++;
      else sore++;
    });

    return [
      { time: "Pagi", v: pagi },
      { time: "Siang", v: siang },
      { time: "Sore", v: sore },
    ];
  }, [violationsOnly]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[180px] flex-shrink-0">
      {/* Chart Tren 24 Jam */}
      <div
        className={`bg-white dark:bg-[#121214] p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col h-[200px] md:h-full transition-all duration-500 w-full ${
          tourStep === 5
            ? "ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-white dark:bg-[#121214] scale-[1.01] relative z-[10002]"
            : "relative z-10"
        }`}
      >
        <div className="flex justify-between items-center mb-3 relative z-10">
          <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
            Tren Deteksi Real-time
          </h3>
        </div>
        <div className="flex-1 w-full h-[150px] md:h-auto min-h-0 relative z-10">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={150}
          >
            <AreaChart
              data={realChartData}
              margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAman2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBahaya2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#52525b"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="time"
                fontSize={9}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a" }}
                dy={5}
              />
              <YAxis
                fontSize={9}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a" }}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #27272a",
                  backgroundColor: "#18181b",
                  color: "#f4f4f5",
                  fontSize: "10px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                }}
              />
              <Area
                type="monotone"
                dataKey="aman"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAman2)"
              />
              <Area
                type="monotone"
                dataKey="insiden"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBahaya2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Pola Waktu Insiden (SEKARANG DINAMIS) */}
      <div
        className={`bg-white dark:bg-[#121214] p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col h-[200px] md:h-full transition-all duration-500 w-full ${
          tourStep === 6
            ? "ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-white dark:bg-[#121214] scale-[1.01] relative z-[10002]"
            : "relative z-10"
        }`}
      >
        <div className="flex justify-between items-center mb-3 relative z-10">
          <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
            Distribusi Insiden (Pola)
          </h3>
        </div>
        <div className="flex-1 w-full h-[150px] md:h-auto min-h-0 relative z-10">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={150}
          >
            {/* 🔥 Pakai timePatternData, bukan hardcode lagi */}
            <BarChart
              data={timePatternData}
              margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#52525b"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="time"
                fontSize={9}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a" }}
                dy={5}
              />
              <YAxis
                fontSize={9}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a" }}
              />
              <RechartsTooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #27272a",
                  backgroundColor: "#18181b",
                  color: "#f4f4f5",
                  fontSize: "10px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                }}
              />
              {/* Bar dibikin ramping biar elegan */}
              <Bar
                dataKey="v"
                name="Jumlah Insiden"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
