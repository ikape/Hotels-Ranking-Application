// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"  // Include src directory if used
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22577A',
        secondary: '#38A3A5',
        accent: '#57CC99',
      },
    },
  },
  plugins: [],
};
