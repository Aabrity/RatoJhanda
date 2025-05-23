/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  // Enable dark mode (can be 'media' or 'class')
  darkMode: 'media', // use 'media' if you prefer system preference
  theme: {
    extend: {},
  },
  plugins: [flowbite, tailwindScrollbar],
};
