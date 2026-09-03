/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bijou: {
          gold: '#D4AF37',       
          goldLight: '#F3E5AB', 
          cream: '#FAFAFA',      
          dark: '#1A1A1A',       
          warmGray: '#8C857B',   
        }
      }
    },
  },
  plugins: [],
}