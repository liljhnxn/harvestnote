import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#DDD5C0",
        primary: {
          DEFAULT: "#354B32",
          dark: "#253523",
          light: "#445f40",
        },
        accent: {
          DEFAULT: "#D69B52",
          hover: "#be833a",
          light: "#faeedb",
        },
        secondary: {
          DEFAULT: "#829477",
          dark: "#68775f",
          light: "#a2b199",
        },
        mainText: "#292D26",
        cardBg: "#FFFFFF",
        borderSoft: "#E4E0D4",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", '"Times New Roman"', "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      boxShadow: {
        journal: "0 4px 20px -2px rgba(53, 75, 50, 0.06), 0 2px 6px -1px rgba(53, 75, 50, 0.04)",
        card: "0 2px 12px 0 rgba(41, 45, 38, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

