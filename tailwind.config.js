/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    {pattern: /text-(red|green|blue|yellow|orange|purple|pink)-500/},
    {pattern: /bg-(red|green|blue|yellow|orange|purple|pink)-200/}
  ],
}
