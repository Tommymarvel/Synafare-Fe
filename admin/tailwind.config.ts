import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mikado-yellow': '#FFC709',
        raisin: '#282928',
        'gray-1': '#F2F4F7',
        'gray-2': '#EAECF0',
        'gray-3': '#98A2B3',
        'gray-4': '#D0D5DD',
        'gray-5': '#667085',
        'tertiary-1': '#FD853A',
        'tertiary-2': '#FEF7ED',
        'purple-1': '#9B51E0',
        'purple-2': '#F4EBFF',
        'red-1': '#F04438',
        'red-2': '#FEF3F2',
        'green-1': '#12B76A',
        'green-2': '#ECFDF3',
        'blue-1': '#1570EF',
        'blue-2': '#EFF8FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
