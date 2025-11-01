import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f8ff",
          100: "#e5f0ff",
          200: "#bfdcff",
          300: "#94c5ff",
          400: "#5ba0ff",
          500: "#2d7dff",
          600: "#1862db",
          700: "#144eb0",
          800: "#133f8a",
          900: "#103570"
        }
      }
    }
  },
  plugins: []
};

export default config;
