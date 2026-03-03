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
        winly: {
          primary: "#0f172a",
          accent: "#3b82f6",
          surface: "#1e293b",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
