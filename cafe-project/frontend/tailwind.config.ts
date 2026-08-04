import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mat antrasit / neredeyse siyah zemin tonlari
        ink: {
          DEFAULT: "#15161A",
          soft: "#1D1F24",
          line: "#2B2D33",
        },
        // Yumusak krem / bej tonlari
        sand: {
          DEFAULT: "#F4EFE6",
          dim: "#E9E1D2",
          deep: "#D8CBB3",
        },
        // Ince gold detaylar - dozunda kullanilacak vurgu rengi
        gilt: {
          DEFAULT: "#B8935B",
          light: "#D4B483",
          dim: "#8C6F45",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
