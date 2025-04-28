/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        header: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
        sans: ["Quicksand", "sans-serif"],
        fun: ["Fredoka", "sans-serif"],
        playful: ["Montserrat Alternates", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
