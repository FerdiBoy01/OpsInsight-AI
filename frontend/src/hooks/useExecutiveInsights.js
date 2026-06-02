// src/hooks/useExecutiveInsights.js
import { useState, useMemo } from "react";

export function useExecutiveInsights(alerts) {
  const [isExporting, setIsExporting] = useState(false);

  // ==========================================
  // 🔥 MESIN PENGOLAH DATA REAL-TIME 🔥
  // ==========================================
  const stats = useMemo(() => {
    const violationsOnly = alerts.filter(
      (a) => !a.detail.includes("Compliant"),
    );
    const totalViolations = violationsOnly.length;

    const realSafetyIndex =
      alerts.length === 0
        ? 100
        : Math.max(0, parseFloat((100 - totalViolations * 0.5).toFixed(1)));

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
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return {
    stats,
    aiInsight,
    isGeneratingInsight,
    fetchAiInsight,
    isExporting,
    handleExport,
  };
}
