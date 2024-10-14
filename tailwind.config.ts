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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "my-color": "#FFE5D4",
        "my-color2": "#FE9172",
        "my-color3": "#FFDED5",
      },
      fontFamily: {
        sans: ["sans-serif", "Inter"],
      },
    },
  },
  plugins: [],
};

export default config;
