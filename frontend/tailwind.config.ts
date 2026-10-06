import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A2333",
        navy: { DEFAULT: "#1E3A5F", dark: "#132840" },
        maroon: "#7A1F2B",
        gold: { DEFAULT: "#B8892B", light: "#D9B968" },
        paper: { DEFAULT: "#EFEEE5", line: "#D9D4C2" },
        muted: "#6B7280",
        ok: { DEFAULT: "#2F6B4F", bg: "#E7F0EA" },
        warn: { DEFAULT: "#B8892B", bg: "#F6EEDC" },
        danger: { DEFAULT: "#A23B3B", bg: "#F5E7E7" }
      },
      fontFamily: {
      serif: ["var(--font-serif)", "Georgia", "serif"],
      sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        card: "0 2px 10px rgba(19,40,64,.08), 0 1px 2px rgba(19,40,64,.06)"
      }
    }
  },
  plugins: []
};
export default config;
