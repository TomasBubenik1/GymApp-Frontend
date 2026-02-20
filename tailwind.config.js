/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        exerciseListContainer: "650px",
        l: "650px",
        mL: "500px",
      },
      fontSize: {
        navIcons: "36px",
        half2xl: "22px",
      },
      colors: {
        backgroundcolor: "#000000",
        backgroundHover: "#080808",
        primary: "#28671E",
        secondary: "#071815",
        accent: "#46B635",
        accentGlow: "#22ff00",
        text: "#F6F6F6",
        foreground: "#18181B",
        foregroundhover: "#1D1F23",
      },
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        "spin-custom": {
          to: { transform: "rotate(360deg)" },
        },
        "step-in": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        shake: "shake 0.3s ease",
        "spin-custom": "spin-custom 0.6s linear infinite",
        "step-in": "step-in 0.35s ease forwards",
      },
    },
  },
  plugins: [],
};