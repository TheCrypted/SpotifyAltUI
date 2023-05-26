/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html, js}"],
  theme: {
    extend: {
      colors:{
        "spGreen": "#1DB954",
        "spBlack": "#191414"
      }
    },
  },
  plugins: ["tailwind-scrollbar"],
}

