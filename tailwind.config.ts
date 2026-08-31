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
        notice: {
          cream: "#fffdf8",
          dark: "#121212",
          gray: "#f4f3ef",
          blue: "#004fff", // Signature Notice Electric Blue
          blueHover: "#003ecc",
          orange: "#ff5200", // Notice Accent Orange
          border: "#e8e5dc",
          muted: "#767676",
        },
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#004fff",
          600: "#0043d9",
          700: "#0035ad",
          800: "#002b8a",
          900: "#002470",
          950: "#001547",
        },
      },
      fontFamily: {
        sans: ["Assistant", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["Nohemi", "Assistant", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.02em",
        wide: "0.06em",
        wider: "0.1em",
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};
export default config;
