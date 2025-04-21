import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        colorGlow: {
          "0%, 100%": { color: "#1f2937" }, // gray-800
          "50%": { color: "#3b82f6" }, // blue-500
        },
        rainbow: {
          "0%, 100%": { color: "#ef4444" }, // red-500
          "14%": { color: "#f97316" }, // orange-500
          "28%": { color: "#eab308" }, // yellow-500
          "42%": { color: "#22c55e" }, // green-500
          "57%": { color: "#3b82f6" }, // blue-500
          "71%": { color: "#8b5cf6" }, // violet-500
          "85%": { color: "#ec4899" }, // pink-500
        },
        borderGlow: {
          "0%": { boxShadow: "0 0 8px 2px #f87171" }, // red
          "25%": { boxShadow: "0 0 12px 4px #facc15" }, // yellow
          "50%": { boxShadow: "0 0 12px 4px #34d399" }, // green
          "75%": { boxShadow: "0 0 12px 4px #60a5fa" }, // blue
          "100%": { boxShadow: "0 0 8px 2px #f87171" }, // red
        },
        slideInOut: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "30%": { transform: "translateX(0)", opacity: "1" },
          "70%": { transform: "translateX(0)", opacity: "1" }, // ค้างไว้ 3s ตรงนี้
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        textGlow: {
          "0%, 100%": {
            textShadow:
              "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.3)",
          },
          "50%": {
            textShadow:
              "0 0 5px rgba(0, 255, 255, 1), 0 0 10px rgba(0, 255, 255, 1), 0 0 15px rgba(0, 255, 255, 1)",
          },
        },
      },
      animation: {
        colorGlow: "colorGlow 2s ease-in-out infinite",
        rainbow: "rainbow 3s linear infinite",
        borderGlow: "borderGlow 4s ease-in-out infinite",
        "slide-in-out": "slideInOut 6s ease-in-out infinite",
        textGlow: "textGlow 2s ease-in-out infinite", // Add new animation
      },
    },
  },
  plugins: [],
};

export default config;
