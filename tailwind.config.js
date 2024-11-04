/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('../src/assets/BG.png')",
      },
      borderColor: {
        'custom-gradient': 'linear-gradient(90deg, #3790FF, #86AFFF, #0067A1)',
      },
      screens: {
        sm: "450px", // Custom small screen starting from 450px
      },
    },
  },
  plugins: [],
}

