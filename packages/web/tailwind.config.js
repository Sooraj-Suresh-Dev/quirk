/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#E8725C',
          hover: '#D4614A',
          active: '#C05540',
        },
        mint: {
          DEFAULT: '#8FB8A8',
          hover: '#7BA898',
        },
        cream: '#F5F0E8',
        'soft-white': '#FDFBF7',
        charcoal: '#1d1d1dff',
        'warm-gray': '#3D3D3D',
        'deep-black': '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        serif: ['"Lora"', 'serif'],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        pill: '20px',
      },
      boxShadow: {
        card: '4px 4px 0px #1A1A1A',
        'card-hover': '6px 6px 0px #1A1A1A',
        button: '3px 3px 0px #1A1A1A',
        'button-hover': '5px 5px 0px #1A1A1A',
        'button-active': '1px 1px 0px #1A1A1A',
        input: '2px 2px 0px #1A1A1A',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
