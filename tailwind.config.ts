import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        creepster: ["Creepster", "serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out forwards",
        "zoom-in-out": "zoomInOut 2s ease-in-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        zoomInOut: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [tailwindScrollbar],
} satisfies Config;
