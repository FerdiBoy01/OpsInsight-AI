// src/pages/Settings.jsx
import React from "react";
import SettingsHeader from "../components/settings/SettingsHeader";
import AnalyticsToggleCard from "../components/settings/AnalyticsToggleCard";

export default function Settings({ showAnalytics, toggleAnalytics }) {
  return (
    <div className="p-4 md:px-8 md:pb-6 pt-4 animate-in fade-in duration-500">
      <SettingsHeader />

      <AnalyticsToggleCard
        showAnalytics={showAnalytics}
        toggleAnalytics={toggleAnalytics}
      />
    </div>
  );
}
