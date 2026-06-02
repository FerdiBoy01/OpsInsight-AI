// src/utils/helpers.js

export const API_BASE_URL =
  "https://opsin1-gjfwhmg2ftf3hahu.indonesiacentral-01.azurewebsites.net";

export const terjemahkanDetail = (text) => {
  if (!text) return "";
  const map = {
    "NO HELMET": "Tanpa Helm",
    "NO VEST": "Tanpa Rompi",
    "NO GLOVES": "Tanpa Sarung Tangan",
    "NO BOOTS": "Tanpa Sepatu",
    "NO GOGGLES": "Tanpa Kacamata",
    Compliant: "Sesuai SOP",
  };

  for (const [key, value] of Object.entries(map)) {
    if (text.toUpperCase().includes(key)) return value;
  }
  return text;
};

export const getSafeImageUrl = (rawUrl) => {
  if (!rawUrl) return null;
  // CHEAT CODE VERCEL
  if (rawUrl.includes("localhost:3000")) {
    return rawUrl.replace(/http:\/\/localhost:3000/g, API_BASE_URL);
  }
  if (rawUrl.startsWith("/uploads/")) {
    return `${API_BASE_URL}${rawUrl}`;
  }
  return rawUrl;
};
