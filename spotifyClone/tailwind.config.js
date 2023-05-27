/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html, js}"],
  theme: {
    extend: {
      colors:{
        "spGreen": "#1DB954",
        "spBlack": "#191414",
        "hoverLighten": "rgb(45, 40, 40)",
        "superLightBlack": "rgb(60, 50, 50)"
      }
    },
  },
  plugins: ["tailwind-scrollbar"],
}

