/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        stone: {
          50: '#fcfaf8',
          100: '#f5f2ed', // Warm background
          200: '#e6e0d6',
          300: '#d1c7b8',
          400: '#b0a390',
          500: '#948672',
          600: '#7a6c5b',
          700: '#5c5144',
          800: '#3e362e',
          900: '#26221d',
        },
        // Muted Green Accent
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5dac5',
          300: '#9cbfa5',
          400: '#749f7f',
          500: '#52805e',
          600: '#3e6348',
          700: '#334f3b',
          800: '#2a3e30',
          900: '#233328',
        },
        sky: {
          50: '#EDF4F8',
          // ... existing sky if needed, or remove if unused in new design
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    }
  },
  plugins: [],
}
