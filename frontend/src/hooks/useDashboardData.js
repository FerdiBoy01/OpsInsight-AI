// src/hooks/useDashboardData.js
import { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../utils/helpers";

export function useDashboardData(alerts) {
  const [cameras, setCameras] = useState([]);
  const [activeCam, setActiveCam] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isAiActive, setIsAiActive] = useState(true);

  // STATE VIDEO & COLD START
  const [isVideoError, setIsVideoError] = useState(false);
  const [isSystemBooting, setIsSystemBooting] = useState(true);

  // TECH STATUS ENGINE
  const [techStats, setTechStats] = useState({
    latency: 84,
    fps: 27,
    health: "Excellent",
    calibration: "Optimized",
  });

  // Efek simulasi fluktuasi network & AI
  useEffect(() => {
    if (!isAiActive || isSystemBooting) return;
    const interval = setInterval(() => {
      setTechStats((prev) => {
        if (prev.calibration === "Calibrating...") return prev;
        return {
          ...prev,
          latency: Math.floor(Math.random() * (95 - 65 + 1) + 65),
          fps: Math.floor(Math.random() * (30 - 24 + 1) + 24),
        };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isAiActive, isSystemBooting]);

  const fetchData = async () => {
    try {
      const resCam = await fetch(`${API_BASE_URL}/api/cameras`);
      const dataCam = await resCam.json();
      setCameras(dataCam);

      const active = dataCam.find((c) => c.isActive) || dataCam[0];
      setActiveCam(active);

      if (active) {
        setVideoUrl(`${active.url}?t=${Date.now()}`);
        setIsVideoError(false);
      }

      const resConf = await fetch(`${API_BASE_URL}/api/config`);
      const dataConf = await resConf.json();
      setIsAiActive(dataConf.ai_active);
    } catch (err) {
      console.error("Gagal menarik data dari Azure:", err);
    } finally {
      setIsSystemBooting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAi = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/config/toggle-ai`, {
        method: "POST",
      });
      const data = await res.json();
      setIsAiActive(data.ai_active);
    } catch (err) {
      console.error("Gagal toggle AI di Azure", err);
    }
  };

  const handleSwitchCamera = async (e) => {
    const camId = e.target.value;
    if (!camId) return;
    setIsVideoError(false);

    setTechStats((prev) => ({
      ...prev,
      calibration: "Calibrating...",
      health: "Buffering",
      fps: "--",
    }));

    await fetch(`${API_BASE_URL}/api/cameras/switch/${camId}`, {
      method: "POST",
    });

    setTimeout(() => {
      fetchData();
      setTechStats((prev) => ({
        ...prev,
        calibration: "Optimized",
        health: "Excellent",
      }));
    }, 1500);
  };

  // ==========================================
  // 🔥 AUTO-HEALING PROTOCOL 🔥
  // ==========================================
  const handleVideoError = () => {
    if (!activeCam || !isAiActive) return;

    setIsVideoError(true);
    setTechStats((prev) => ({ ...prev, health: "Connection Lost", fps: "0" }));

    // Coba pancing ulang URL stream tiap 3 detik
    setTimeout(() => {
      console.log("♻️ Auto-healing: Mencoba menghubungkan ulang...");
      setVideoUrl(`${activeCam.url}?retry=${Date.now()}`);
    }, 3000);
  };

  const handleVideoSuccess = () => {
    setIsVideoError(false);
    setTechStats((prev) => ({ ...prev, health: "Excellent" }));
  };

  // ==========================================
  // PERHITUNGAN STATISTIK (Memoized agar optimal)
  // ==========================================
  const filteredAlerts = useMemo(
    () => (activeCam ? alerts.filter((a) => a.zone === activeCam.name) : []),
    [alerts, activeCam],
  );

  const compliantCount = filteredAlerts.filter((a) =>
    a.detail.includes("Compliant"),
  ).length;

  const violationCount = filteredAlerts.length - compliantCount;

  const violationsOnly = filteredAlerts.filter(
    (a) => !a.detail.includes("Compliant"),
  );

  const realProdScore =
    filteredAlerts.length === 0
      ? 100
      : Math.round((compliantCount / filteredAlerts.length) * 100);

  const safetyIndex = Math.max(
    0,
    parseFloat((100 - violationCount * 0.5).toFixed(1)),
  );

  return {
    cameras,
    activeCam,
    videoUrl,
    isAiActive,
    isVideoError,
    isSystemBooting,
    techStats,
    handleToggleAi,
    handleSwitchCamera,
    handleVideoError,
    handleVideoSuccess,
    filteredAlerts,
    compliantCount,
    violationCount,
    violationsOnly,
    realProdScore,
    safetyIndex,
  };
}
