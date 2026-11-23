/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Paleta neo-brutalista: colores planos y saturados + negro puro
      colors: {
        brutal: {
          ink: '#000000',
          paper: '#FFFBEA',
          yellow: '#FFE500',
          pink: '#FF90E8',
          blue: '#90C2FF',
          green: '#7CF5A6',
          red: '#FF6B6B',
        },
      },
      // Sombras duras desplazadas, sin desenfoque (rasgo principal del brutalismo)
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #000',
        brutal: '4px 4px 0 0 #000',
        'brutal-lg': '8px 8px 0 0 #000',
      },
      borderWidth: {
        3: '3px',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 180ms ease-out',
      },
    },
  },
  plugins: [],
};
