/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        slate: "#112033",
        mist: "#d8e6f2",
        signal: {
          cyan: "#6ae3ff",
          amber: "#f7b955",
          coral: "#ff7a6b",
          lime: "#84f0b6",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(71, 255, 157, 0.08), 0 22px 50px rgba(0, 0, 0, 0.34), 0 0 28px rgba(71, 255, 157, 0.04)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(71, 255, 157, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(71, 255, 157, 0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
