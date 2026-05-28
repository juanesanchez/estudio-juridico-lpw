import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        coal: "#11100d",
        gold: "#b99a5b",
        "gold-soft": "#d5c18b",
        parchment: "#f6f1e8",
        porcelain: "#fdfcf9",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(185, 154, 91, 0.22)",
        lift: "0 26px 70px rgba(0, 0, 0, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
