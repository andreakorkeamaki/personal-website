/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nero: "#0F0E0E",
        avorio: "#FFFDF6",
        crema: "#F5EDCE",
        azzurro: "#4DA8DA",
        viola: "#52357B",
        teal: "#468A9A",
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        body: ["var(--font-inter)"],
      },
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        bounceSlow: 'bounceSlow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

