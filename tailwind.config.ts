import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5f0',
          100: '#fde8db',
          200: '#fbcdb5',
          300: '#f8a982',
          400: '#f4804d',
          500: '#f06529',
          600: '#e14d1e',
          700: '#ba3a18',
          800: '#95301a',
          900: '#792b19',
        },
        gold: {
          50: '#f8f4f0',
          100: '#efe5db',
          200: '#dfc9b5',
          300: '#cca688',
          400: '#b88360',
          500: '#a96a44',
          600: '#955438',
          700: '#7c4230',
          800: '#67372c',
          900: '#573028',
        },
        neutral: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#ebe1d5',
          300: '#dccbb8',
          400: '#c5ab93',
          500: '#ae8f77',
          600: '#977762',
          700: '#7d6252',
          800: '#675146',
          900: '#56443c',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
