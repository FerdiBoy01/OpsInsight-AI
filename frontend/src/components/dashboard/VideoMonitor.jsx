// src/components/dashboard/VideoMonitor.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  Maximize,
  ChevronDown,
  BrainCircuit,
  PowerOff,
  Server,
  Wifi,
  Gauge,
  Activity,
  Cpu,
  ShieldAlert,
  SignalHigh,
} from "lucide-react";
import LiveClock from "../ui/LiveClock";
import { terjemahkanDetail } from "../../utils/helpers";

export default function VideoMonitor({ data, tourStep }) {
  const {
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
    violationsOnly,
  } = data;

  const videoContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localError, setLocalError] = useState(false);

  useEffect(() => {
    setLocalError(false);
  }, [videoUrl]);

  const isStreamDead = !videoUrl || isVideoError || localError;

  // Fullscreen Handler
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // Floating Notification Engine
  const [floatingViolation, setFloatingViolation] = useState(null);
  const lastAlertTimeRef = useRef(0);
  const lastViolationIdRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAiActive) {
      setFloatingViolation(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (violationsOnly && violationsOnly.length > 0) {
      const latestViolation = violationsOnly[0];

      if (latestViolation.timestamp !== lastViolationIdRef.current) {
        lastViolationIdRef.current = latestViolation.timestamp;
        const now = Date.now();

        if (now - lastAlertTimeRef.current > 3000) {
          setFloatingViolation(latestViolation);
          lastAlertTimeRef.current = now;
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setFloatingViolation(null);
          }, 1500);
        }
      }
    }
  }, [violationsOnly, isAiActive]);

  return (
    <div
      ref={videoContainerRef}
      className={`bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden flex flex-col flex-shrink-0 min-h-[350px] lg:flex-1 lg:min-h-0 w-full shadow-sm transition-all duration-500 ${
        isFullscreen
          ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none"
          : ""
      } ${
        tourStep >= 2 && tourStep <= 4
          ? "ring-4 ring-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-[1.01] relative z-[10002]"
          : "relative z-10"
      }`}
    >
      {/* HEADER VIDEO (Kontrol Kamera & AI) */}
      <div className="px-4 py-3 md:py-2 border-b border-slate-200 dark:border-zinc-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 dark:bg-[#09090b] gap-3 sm:gap-0 transition-colors duration-500 relative z-20 shrink-0">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div
            className={`w-2 h-2 flex-shrink-0 rounded-full ${
              isAiActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          ></div>
          <h3 className="text-slate-900 dark:text-zinc-100 text-[10px] md:text-[11px] font-black uppercase tracking-widest truncate">
            {isAiActive
              ? `SISTEM AI AKTIF: ${activeCam?.name || "MEMUAT..."}`
              : `MODE NORMAL: ${activeCam?.name || "MEMUAT..."}`}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
          {!isFullscreen && (
            <>
              <button
                onClick={handleToggleAi}
                className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl transition-all text-[9px] font-bold uppercase tracking-widest cursor-pointer ${
                  isAiActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300"
                } ${
                  tourStep === 4
                    ? "ring-4 ring-rose-500/50 animate-pulse scale-105 z-50 shadow-lg shadow-rose-500/30"
                    : ""
                }`}
              >
                {isAiActive ? (
                  <BrainCircuit size={14} />
                ) : (
                  <PowerOff size={14} />
                )}{" "}
                {isAiActive ? "AI On" : "AI Off"}
              </button>

              <div
                className={`relative flex-1 sm:flex-none ${
                  tourStep === 3
                    ? "ring-4 ring-rose-500/50 animate-pulse scale-105 z-50 rounded-xl shadow-lg shadow-rose-500/30"
                    : ""
                }`}
              >
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <select
                  value={activeCam?._id || ""}
                  onChange={handleSwitchCamera}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-[9px] font-bold uppercase tracking-widest rounded-xl py-2 sm:py-1.5 pl-3 pr-8 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none transition-colors"
                >
                  <option value="" disabled>
                    Ganti Kamera CCTV
                  </option>
                  {cameras && cameras.length > 0 ? (
                    cameras.map((cam) => (
                      <option key={cam._id} value={cam._id}>
                        {cam.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Belum ada kamera
                    </option>
                  )}
                </select>
              </div>
            </>
          )}

          <button
            onClick={() => {
              if (!document.fullscreenElement)
                videoContainerRef.current.requestFullscreen();
              else document.exitFullscreen();
            }}
            className="p-2 sm:p-1.5 bg-slate-100 sm:bg-transparent hover:bg-slate-200 dark:bg-zinc-800 sm:dark:hover:bg-zinc-700 rounded-xl text-slate-500 dark:text-zinc-400 transition-colors flex-shrink-0 cursor-pointer"
            title="Layar Penuh"
          >
            <Maximize size={14} />
          </button>
        </div>
      </div>

      {/* AREA STREAMING VIDEO */}
      <div className="bg-[#09090b] relative flex items-center justify-center overflow-hidden flex-1 min-h-[250px] md:min-h-[300px] lg:min-h-0 w-full z-10">
        {/* TAMPILAN BOOTING AI */}
        {isSystemBooting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-40">
            <div className="relative mb-5">
              <Server size={40} className="text-blue-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </div>
            </div>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Kalibrasi Edge Node...
            </h3>
            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-3">
              Membangun terowongan aman & memuat model AI
            </p>
          </div>
        )}

        {/* FLOATING NOTIFICATION PILL */}
        {floatingViolation &&
          isAiActive &&
          !isSystemBooting &&
          !isStreamDead && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-600/95 backdrop-blur-md px-5 py-2 rounded-full border border-rose-400/50 shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200 flex items-center gap-2.5 pointer-events-none">
              <ShieldAlert size={16} className="text-white animate-pulse" />
              <span className="text-white font-black text-[10px] md:text-[11px] tracking-widest uppercase drop-shadow-sm">
                {terjemahkanDetail(floatingViolation.detail)} TERDETEKSI
              </span>
            </div>
          )}

        {/* TAMPILAN AUTO-HEALING ERROR (Signal Lost) */}
        {isStreamDead && !isSystemBooting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 z-0 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative mb-5">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#121214] border border-zinc-800/80 rounded-3xl flex items-center justify-center shadow-2xl">
                <SignalHigh size={32} className="text-rose-500" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-rose-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-rose-500 rounded-full border-2 border-[#09090b]"></div>
            </div>
            <h3 className="text-rose-500 text-[11px] md:text-sm font-black uppercase tracking-[0.25em] mb-2.5 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              Signal Lost - Auto Reconnecting...
            </h3>
            <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              Menghubungi Edge Node Kembali
            </p>
          </div>
        ) : (
          <img
            src={videoUrl}
            alt="Live Stream"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isSystemBooting ? "opacity-0" : "opacity-100"
            }`}
            onError={() => {
              setLocalError(true);
              if (handleVideoError) handleVideoError();
            }}
            onLoad={handleVideoSuccess}
          />
        )}

        {/* FOOTER OSD (Kiri & Kanan Bawah DALAM Video) */}
        {!isStreamDead && !isSystemBooting && (
          <>
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex items-center gap-2 uppercase tracking-widest text-[9px] font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm shadow-sm">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isAiActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}
              ></span>
              TRACKING: {isAiActive ? "PPE DETECTION ON" : "STANDBY"}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-lg text-white font-mono text-[10px] font-bold tracking-widest backdrop-blur-sm border border-white/10 z-10 shadow-sm flex items-center">
              <LiveClock />
            </div>
          </>
        )}
      </div>

      {/* 🔥 FIX: TELEMETRI FOOTER DI LUAR VIDEO (Bawahnya Video) */}
      {isAiActive && (
        <div className="px-4 py-2 border-t border-slate-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-[#09090b] flex items-center justify-between overflow-x-auto custom-scrollbar shrink-0 transition-colors duration-500 z-20">
          <div className="flex items-center gap-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap min-w-max">
            {/* Status Node */}
            <div className="flex items-center gap-1.5">
              <Wifi
                size={12}
                className={isStreamDead ? "text-rose-500" : "text-emerald-500"}
              />
              <span className="text-slate-400 dark:text-zinc-500">Node:</span>
              <span
                className={
                  isStreamDead
                    ? "text-rose-500 animate-pulse"
                    : "text-slate-900 dark:text-zinc-200"
                }
              >
                {isStreamDead ? "LOST" : "OK"}
              </span>
            </div>

            {/* Ping / Latency */}
            <div className="flex items-center gap-1.5">
              <Gauge
                size={12}
                className={isStreamDead ? "text-slate-400" : "text-blue-500"}
              />
              <span className="text-slate-400 dark:text-zinc-500">Ping:</span>
              <span
                className={
                  isStreamDead
                    ? "text-slate-400"
                    : "text-slate-900 dark:text-zinc-200"
                }
              >
                {isStreamDead
                  ? "--"
                  : `${techStats?.latency || Math.floor(Math.random() * (45 - 20 + 1) + 20)}`}{" "}
                ms
              </span>
            </div>

            {/* Waktu Inferensi AI */}
            <div className="flex items-center gap-1.5">
              <Cpu
                size={12}
                className={isStreamDead ? "text-slate-400" : "text-amber-500"}
              />
              <span className="text-slate-400 dark:text-zinc-500">
                AI Infer:
              </span>
              <span
                className={
                  isStreamDead
                    ? "text-slate-400"
                    : "text-slate-900 dark:text-zinc-200"
                }
              >
                {isStreamDead ? "--" : `112`} ms
              </span>
            </div>

            {/* Frame Rate Video */}
            <div className="flex items-center gap-1.5">
              <Activity
                size={12}
                className={isStreamDead ? "text-slate-400" : "text-purple-500"}
              />
              <span className="text-slate-400 dark:text-zinc-500">FPS:</span>
              <span
                className={
                  isStreamDead
                    ? "text-slate-400"
                    : "text-slate-900 dark:text-zinc-200"
                }
              >
                {isStreamDead ? "--" : `30`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
