import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        watermelon: {
          50: "#fdebe6",
          100: "#fbd7cd",
          200: "#f7af9b",
          300: "#f6a58f",
          400: "#f59b82",
          500: "#dd8c75",
          600: "#c47c68",
          700: "#ac6d5b",
          800: "#935d4e",
          900: "#7b4e41",
        },
      },
      animation: {
        "pulse-bg": "pulseBg 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulseBg: {
          "0%, 100%": { backgroundColor: "rgba(187,247,208,1)" },
          "50%": { backgroundColor: "rgba(187,247,208,0.5)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)"],
        display: ["var(--font-dm-serif)"],
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};
export default config;
