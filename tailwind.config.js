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
    },
  },
  plugins: [],
};
