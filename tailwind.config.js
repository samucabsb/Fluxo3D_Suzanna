/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sus: {
          bg: '#f5f9ff',
          ink: '#0a1b3d',
          muted: '#5b6b8c',
          deep: '#1e40af',
          primary: '#2563eb',
          light: '#60a5fa',
          ice: '#dbeafe',
          success: '#16a34a',
        },
        navy: {
          850: '#0f172a',
          900: '#0a1b3d',
          950: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'liquid': '0 10px 32px 0 rgba(30, 64, 175, 0.08), 0 2px 6px -1px rgba(30, 64, 175, 0.04)',
        'liquid-hover': '0 14px 40px 0 rgba(30, 64, 175, 0.14)',
      }
    },
  },
  plugins: [],
}
