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
        emerald: {
          950: "#06120c",
          900: "#0b1d14",
          850: "#0e261a",
          800: "#133524",
          700: "#1c4d34",
          600: "#276d49",
        },
        gold: {
          100: "#fcf6ba",
          200: "#f6e48c",
          300: "#e6cc65",
          400: "#d4af37",
          500: "#c5a059",
          600: "#aa802b",
          700: "#86601b",
          800: "#5c4110",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "Montserrat", "sans-serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #fcf6ba 0%, #d4af37 35%, #aa802b 70%, #d4af37 100%)",
        "gold-metallic": "linear-gradient(110deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)",
        "emerald-radial": "radial-gradient(circle at 50% 20%, #133524 0%, #0b1d14 60%, #06120c 100%)",
        "card-glass": "linear-gradient(135deg, rgba(19, 53, 36, 0.55) 0%, rgba(11, 29, 20, 0.75) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -3px rgba(212, 175, 55, 0.35)",
        "gold-subtle": "0 0 15px -2px rgba(212, 175, 55, 0.2)",
        "emerald-deep": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
