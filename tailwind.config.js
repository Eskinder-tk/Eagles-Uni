/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        graduate: ['var(--font-graduate)', 'serif'],
      },
      colors: {
        brand: {
          blue: '#1b365d',
          yellow: '#eab308',
        },
      },
    },
  },
  plugins: [],
};