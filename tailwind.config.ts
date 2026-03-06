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
        background: "#0d1624",
        surface: "#111d2e",
        "surface-2": "#162236",
        border: "#1e2f45",
        "border-subtle": "#162236",
        gold: "#E8A838",
        "gold-dim": "#b87d20",
        blue: "#4A90D9",
        green: "#27AE60",
        red: "#E05C3A",
        purple: "#9B59B6",
        teal: "#1ABC9C",
        "text-primary": "#f0f4f8",
        "text-secondary": "#8ca3be",
        "text-muted": "#4a6785",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,47,69,0.8)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,144,217,0.3)",
        glow: "0 0 20px rgba(232,168,56,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,168,56,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(232,168,56,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
