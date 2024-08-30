/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        mocha:'#92736c',
        blush:'#ebc8b3',
        linen:'#ece7e2',
        seafoam:'#c0cace',
        sagegreen:'#9dbbae',
      }
    },
  },
  plugins: [],
}

