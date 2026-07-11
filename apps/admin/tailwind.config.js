/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F172A",
          orange: "#EA580C",
          rose: "#E11D48",
          cyan: "#06B6D4",
          slate: {
            950: "#020617",
            900: "#0F172A",
            800: "#1E293B",
            700: "#334155",
            600: "#475569",
            100: "#F1F5F9",
            50: "#F8FAFC",
          }
        }
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #EA580C, #E11D48)",
        "brand-glow": "radial-gradient(circle, rgba(234,88,12,0.15) 0%, rgba(225,29,72,0) 70%)",
      }
    },
  },
  plugins: [],
}
