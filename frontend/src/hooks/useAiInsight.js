// src/hooks/useAiInsight.js
import { useState } from "react";
import { terjemahkanDetail } from "../utils/helpers";

export function useAiInsight() {
  const [aiInsight, setAiInsight] = useState({
    trend:
      "Sistem siap. Tekan tombol 'Analyze Now' untuk memproses data area menggunakan AI.",
    action: "Menunggu instruksi pembuatan rekomendasi dari Engine.",
  });
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const fetchAiInsight = async (
    violationsOnly,
    violationCount,
    realProdScore,
  ) => {
    setIsGeneratingInsight(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key Gemini belum dipasang!");

      // Jika tidak ada pelanggaran, tidak perlu panggil AI (hemat kuota)
      if (violationsOnly.length === 0) {
        setAiInsight({
          trend: `Tingkat kepatuhan sempurna (${realProdScore}%). Area kerja terpantau aman dari risiko K3.`,
          action: `Pertahankan standar operasional saat ini dan lanjutkan pemantauan visual berkala.`,
        });
        setIsGeneratingInsight(false);
        return;
      }

      const recentViolations = violationsOnly
        .slice(0, 5)
        .map((v) => terjemahkanDetail(v.detail))
        .join(", ");

      const prompt = `Analisis data observasi K3 (Keselamatan Kerja) berikut:
      - Skor Kepatuhan: ${realProdScore}%
      - Jumlah Observasi SOP: ${violationCount}
      - Temuan Terbaru: ${recentViolations}

      Tugas: Buatlah evaluasi singkat. 
      Gunakan format JSON murni persis seperti ini tanpa tambahan apapun:
      {"trend": "evaluasi singkat maksimal 15 kata", "action": "saran tindakan maksimal 15 kata"}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      const data = await res.json();
      const textResult = data.candidates[0].content.parts[0].text;
      const parsedInsight = JSON.parse(textResult);

      setAiInsight({
        trend: parsedInsight.trend || "Data berhasil dianalisis.",
        action: parsedInsight.action || "Tingkatkan pengawasan area.",
      });
    } catch (error) {
      console.error(
        "Gagal terhubung ke Gemini, beralih ke Fallback Mode:",
        error,
      );
      // Animasi loading buatan agar user tidak merasa aplikasi nge-hang
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAiInsight({
        trend:
          violationCount > 5
            ? `Kepatuhan menurun (${realProdScore}%). Terdeteksi anomali pelanggaran berulang.`
            : `Kepatuhan relatif stabil (${realProdScore}%), namun ada temuan minor pada atribut pekerja.`,
        action:
          "Perketat inspeksi di gerbang masuk dan lakukan safety briefing sebelum pergantian shift.",
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return { aiInsight, isGeneratingInsight, fetchAiInsight };
}
