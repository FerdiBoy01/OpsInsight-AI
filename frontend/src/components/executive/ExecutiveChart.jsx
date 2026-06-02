// src/components/executive/ExecutiveChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function ExecutiveChart({ alertsLength, chartData }) {
  return (
    // 🔥 FIX: Pakai h-full dan min-h biar sejajar dengan kotak sebelahnya
    <div className="lg:col-span-2 bg-white dark:bg-[#121214] p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col h-full min-h-[400px] transition-colors w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">
            Tren Kepatuhan Mingguan
          </h3>
          <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 mt-1">
            Rasio kepatuhan SOP vs Pelanggaran dalam 7 hari terakhir
          </p>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-0">
        {alertsLength === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <BarChart3 size={32} className="opacity-20 mb-3" />
            <p className="text-[10px] uppercase tracking-widest font-bold">
              Menunggu Data Sistem
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#52525b"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="day"
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
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "12px",
                  fontSize: "10px",
                  border: "1px solid #27272a",
                  backgroundColor: "#18181b",
                  color: "#f4f4f5",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                  padding: "8px 12px",
                }}
                itemStyle={{ fontWeight: "bold", paddingBottom: "2px" }}
              />
              <Bar
                dataKey="aman"
                name="Sesuai SOP (Aman)"
                stackId="a"
                fill="#10b981"
                barSize={24}
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="insiden"
                name="Pelanggaran (Bahaya)"
                stackId="a"
                fill="#ef4444"
                barSize={24}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
