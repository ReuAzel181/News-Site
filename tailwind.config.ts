import type { Config } from "tailwindcss";
import lineClamp from '@tailwindcss/line-clamp';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  safelist: [
    // Ensure responsive variants for dynamically composed classes in the layout editor
    { pattern: /(grid-cols)-(1|2|3|4|5|6)/, variants: ['md','lg','xl'] },
    { pattern: /(grid-rows)-(1|2|3|4|5|6)/, variants: ['md','lg','xl'] },
    { pattern: /(col-span)-(1|2|3|4|5|6)/, variants: ['md','lg','xl'] },
    { pattern: /(row-span)-(1|2|3|4|5|6)/, variants: ['md','lg','xl'] },
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['var(--font-libre-caslon)', 'Georgia', 'Times New Roman', 'Times', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'deep-blue': '#000057',
        primary: "var(--primary)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      transitionProperty: {
        "height": "height",
        "spacing": "margin, padding",
      },
    },
  },
  plugins: [
    lineClamp,
  ],
};

export default config;