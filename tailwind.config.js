/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevation-high': '0.2px 0.1px 0.3px hsl(var(--shadow-color) / 0.06), 1.7px 1.3px 2.8px -0.2px hsl(var(--shadow-color) / 0.08), 3px 2.4px 5.1px -0.3px hsl(var(--shadow-color) / 0.1), 4.6px 3.6px 7.8px -0.5px hsl(var(--shadow-color) / 0.12), 6.8px 5.3px 11.4px -0.7px hsl(var(--shadow-color) / 0.14), 10px 7.8px 16.8px -0.8px hsl(var(--shadow-color) / 0.16), 14.4px 11.3px 24.3px -1px hsl(var(--shadow-color) / 0.17), 20.5px 16.1px 34.6px -1.2px hsl(var(--shadow-color) / 0.19)',
      }
    },
  },
  plugins: [],
}
