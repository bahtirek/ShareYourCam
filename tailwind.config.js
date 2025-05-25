/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {      colors: {
        primary2: {
          DEFAULT: "#FF692E",
          100: "#FFFBFA",
          200: "#FFD7C7",
          300: "#FFC4AD",
          400: "#FFB294",
          500: "#FF8E61",
          600: "#FF7C47",
          700: "#FF692E",
          800: "#FF5714",
          900: "#FF4900",
        },
        primary: {
          DEFAULT: "#FF4416",
          100: "#FFE8E2",
          200: "#FFD3C9",
          300: "#FFBFAF",
          400: "#FFAA95",
          500: "#FF967C",
          600: "#FF8162",
          700: "#FF6D49",
          800: "#FF5830",
          900: "#FF4416",
        },
        secondary: {
          DEFAULT: "B8B8B8",
          100: "#F0F0F0",
          200: "#D4D4D4",
          300: "#B8B8B8",
          400: "#9D9D9D",
          500: "#838383",
          600: "#6A6A6A",
          700: "#525252",
          800: "#3B3B3B",
          900: "#252525",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#f9f9f9",
        },
      },
    },
  },
  plugins: [],
}