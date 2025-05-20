/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        meteor: {
          "0%": {
            transform: "rotate(var(--angle)) translateX(0)",
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            transform: "rotate(var(--angle)) translateX(-500px)",
            opacity: "0",
          },
        },
        aurora: {
          "0%": {
            "background-position": "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
          "25%": {
            "background-position": "50% 100%",
            transform: "rotate(5deg)  scale(1.1)",
          },
          "50%": {
            "background-position": "100% 50%",
            transform: "rotate(-3deg) scale(0.95)",
          },
          "75%": {
            "background-position": "50% 0%",
            transform: "rotate(3deg)  scale(1.05)",
          },
          "100%": {
            "background-position": "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
        },
      },
      animation: {
        meteor: "meteor 5s linear infinite",
        aurora: "aurora 8s ease-in-out infinite alternate",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
