import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mikado: '#FEC601',
        raisin: '#201E1F',
        peach: '#FFDD95',
        teal: '#407068',
        lavender: '#D2E0FB',
      },
    },
    fontFamily: {
      sans: ['var(--font-be-vietnam-pro)', 'sans-serif'],
    },
  },
  plugins: [],
};

export default config;
