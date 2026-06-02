// src/components/ui/LiveClock.jsx
import React, { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{time.toLocaleTimeString("id-ID")}</>;
}
