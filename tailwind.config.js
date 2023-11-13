/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        navIcons:'28px',
      },
      colors:{
        backgroundcolor: '#000000',
        primary:'#28671E',
        secondary:'#071815',
        accent:'#46B635',
        text:'#F6F6F6',
      },
    },
  },
  plugins: [],
}