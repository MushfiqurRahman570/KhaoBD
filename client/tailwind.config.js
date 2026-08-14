/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ed',
          100: '#ffe6d5',
          400: '#ff8a3d',
          500: '#ff6b1a',
          600: '#f04f00',
          700: '#c73d00',
        },
        paper: '#FBF3E4',
        ink: '#20302B',
        teal: {
          50: '#E6F3F1',
          400: '#2E8F84',
          500: '#0E6E66',
          600: '#0B5A54',
        },
        marigold: {
          50: '#FFF4DE',
          400: '#F7B84B',
          500: '#F4A623',
        },
        ricksha: {
          50: '#FDE8EF',
          400: '#EE6B96',
          500: '#E8467C',
        },
        jackfruit: {
          50: '#EEF5E4',
          400: '#8CB25B',
          500: '#6B8F3D',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['"Hind Siliguri"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
