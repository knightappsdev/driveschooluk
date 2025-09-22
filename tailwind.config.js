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
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d'
        },
        accent: {
          50: '#fefbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706'
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669'
        }
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
      }
    },
  },
  plugins: [],
}
