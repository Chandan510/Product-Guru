/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        earth: ['earth'],
        inter_semibold: ['inter_semibold']
      }

    },
  },
  plugins: [],
};
