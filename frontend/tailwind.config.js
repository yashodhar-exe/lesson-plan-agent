/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#006EFF",
          light: "#CEE3FD",
          bg: "#FBFCFD",
          surface: "#ECF3FC",
          text: "#070513",
          secondary: "#3C5164",
          border: "#C4C8CE",
          muted: "#8A96B1",
          alert: "#D71920"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
