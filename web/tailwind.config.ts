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
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: "#07080b",
        "obsidian-card": "#0d0f15",
        "obsidian-border": "#1e2230",
        "cyan-neon": "#00e5ff",
        "purple-neon": "#a855f7",
        "emerald-neon": "#10b981",
        "amber-neon": "#f59e0b",
        "rose-neon": "#f43f5e",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Menlo", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
