/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  presets: [
    require('@babel/preset-react', '@babel/preset-env')
  ],
  plugins: [
    ["@emotion"]
  ],
}

