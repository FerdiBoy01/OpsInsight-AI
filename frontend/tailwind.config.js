/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Font premium tetap jalan
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    // Pakai tema bawaan (default) yang 100% aman dan langsung dikenali
    themes: ["light", "dark"],
  },
};
