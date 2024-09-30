// tailwind.config.js
import { themePalette } from './themePalette';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...themePalette,  // Spreads the imported palette here
        lightblack: "#242424",
        "deepblue": "#00033F",
        "deeperblue": "#01001C",
        'highlightedtext': '#1E3A8A',
        'unhighlightedtext': '#646FC8',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],  // Use for body text and general UI
        serif: ['IBM Plex Serif', 'serif'],     // Use for headings or emphasis
        mono: ['IBM Plex Mono', 'monospace'],   // Use for data, code, or technical content
      },
      screens: {
        "-2xl": { max: "1535px" },
        "-xl": { max: "1279px" },
        "-lg": { max: "1023px" },
        "-md": { max: "767px" },
        "-sm": { max: "639px" },
      },
    },
  },
  plugins: [],
};
