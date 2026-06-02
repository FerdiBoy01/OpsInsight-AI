// src/pages/ExecutiveInsights.jsx
import React from "react";
import { useExecutiveInsights } from "../hooks/useExecutiveInsights";

// Import Components
import ExecutiveHeader from "../components/executive/ExecutiveHeader";
import ExecutiveKpiCards from "../components/executive/ExecutiveKpiCards";
import ExecutiveChart from "../components/executive/ExecutiveChart";
import ExecutiveAiReport from "../components/executive/ExecutiveAiReport";

export default function ExecutiveInsights({ alerts = [] }) {
  const {
    stats,
    aiInsight,
    isGeneratingInsight,
    fetchAiInsight,
    isExporting,
    handleExport,
  } = useExecutiveInsights(alerts);

  return (
    <main className="px-4 md:px-8 pb-10 md:pb-6 pt-4 md:pt-0 h-full flex flex-col transition-colors duration-500 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <ExecutiveHeader isExporting={isExporting} handleExport={handleExport} />

      <ExecutiveKpiCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <ExecutiveChart
          alertsLength={alerts.length}
          chartData={stats.chartData}
        />

        <ExecutiveAiReport
          aiInsight={aiInsight}
          isGeneratingInsight={isGeneratingInsight}
          fetchAiInsight={fetchAiInsight}
        />
      </div>
    </main>
  );
}
