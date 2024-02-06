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
        navIcons: "28px",
        half2xl: "22px",
      },
      colors: {
        backgroundcolor: "#000000",
        primary: "#28671E",
        secondary: "#071815",
        accent: "#46B635",
        text: "#F6F6F6",
        forground: "#1a1a1a",
      },
    },
  },
  plugins: [],
};
