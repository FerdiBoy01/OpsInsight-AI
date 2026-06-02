// src/components/reports/ReportsChart.jsx
import React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportsChart({ chartView, setChartView, chartData }) {
  return (
    <div className="flex-1 min-h-[200px] md:min-h-[260px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <TrendingUp size={16} md:size={18} />
          </div>
          <div>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-800 dark:text-zinc-200 leading-none">
              Tren Keamanan
            </h3>
            <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase mt-1">
              Log Aman vs Insiden
            </p>
          </div>
        </div>
        <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 self-end sm:self-auto">
          <button
            onClick={() => setChartView("DAILY")}
            className={`px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${
              chartView === "DAILY"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600"
                : "text-slate-500"
            }`}
          >
            HARIAN
          </button>
          <button
            onClick={() => setChartView("MONTHLY")}
            className={`px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${
              chartView === "MONTHLY"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600"
                : "text-slate-500"
            }`}
          >
            BULANAN
          </button>
        </div>
      </div>

      <div className="h-[150px] md:h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              fontWeight="bold"
            />
            <YAxis
              fontSize={9}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              fontWeight="bold"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            />
            <Area
              type="monotone"
              dataKey="aman"
              name="Log Aman"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAman)"
            />
            <Area
              type="monotone"
              dataKey="insiden"
              name="Insiden"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
