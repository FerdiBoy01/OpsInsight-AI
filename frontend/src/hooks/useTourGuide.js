// src/hooks/useTourGuide.js
import { useState, useEffect } from "react";

export function useTourGuide() {
  const [tourStep, setTourStep] = useState(0);
  const [showTourPrompt, setShowTourPrompt] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("opsinsight_tour_completed");
    if (!hasSeenTour) {
      setTimeout(() => setShowTourPrompt(true), 1500);
    }
  }, []);

  const startTour = () => {
    setShowTourPrompt(false);
    setTourStep(1);
  };

  const dismissPrompt = () => {
    setShowTourPrompt(false);
    localStorage.setItem("opsinsight_tour_completed", "true");
  };

  const nextTour = () => {
    if (tourStep >= 8) {
      setTourStep(0);
      localStorage.setItem("opsinsight_tour_completed", "true");
    } else {
      setTourStep(tourStep + 1);
    }
  };

  const skipTour = () => {
    setTourStep(0);
    localStorage.setItem("opsinsight_tour_completed", "true");
  };

  return {
    tourStep,
    showTourPrompt,
    startTour,
    dismissPrompt,
    nextTour,
    skipTour,
  };
}
