import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Newsreader", "Lora", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      colors: {
        terracotta: {
          50: "#FAF4EF",
          100: "#F5E8DE",
          200: "#EACEC0",
          300: "#DDAC9A",
          400: "#CE7D61",
          500: "#C26735",
          600: "#B05429",
          700: "#8E411F",
          800: "#6B3219",
          900: "#4D2413",
        },
        sand: {
          50: "#FDFBF7",
          100: "#FAF7F2",
          200: "#F4EFEA",
          300: "#E9E2D8",
          400: "#D8CEBF",
          500: "#C5B7A3",
          600: "#A4947E",
          700: "#7D6F5B",
          800: "#554B3C",
          900: "#332C22",
        },
        espresso: {
          50: "#F6F4F3",
          100: "#ECE8E5",
          200: "#D8D1CC",
          300: "#BDB3AB",
          400: "#8F8177",
          500: "#675A51",
          600: "#4A3F37",
          700: "#342C26",
          800: "#221C18",
          900: "#161210",
          950: "#0E0B0A",
        },
        clay: {
          DEFAULT: "#E4DCD3",
          dark: "#2C2420",
        },
        ember: "#E59560",
      },
    },
  },
  plugins: [],
};
export default config;
