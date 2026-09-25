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
        background: "#050505",
        surface: "rgba(255, 255, 255, 0.03)",
        glass: {
          light: "rgba(255, 255, 255, 0.08)",
          medium: "rgba(255, 255, 255, 0.04)",
          dark: "rgba(0, 0, 0, 0.6)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-highlight": "rgba(255, 255, 255, 0.25)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(255, 255, 255, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
