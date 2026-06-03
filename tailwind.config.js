/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        background: '#09090b', // zinc-950
        'on-background': '#fafafa', // zinc-50
        surface: '#09090b',
        'surface-dim': '#09090b',
        'surface-bright': '#18181b', // zinc-900
        'surface-container-lowest': '#09090b',
        'surface-container-low': '#09090b',
        'surface-container': '#18181b', // zinc-900
        'surface-container-high': '#27272a', // zinc-800
        'surface-container-highest': '#3f3f46', // zinc-700
        'on-surface': '#fafafa',
        'on-surface-variant': '#a1a1aa', // zinc-400
        'inverse-surface': '#fafafa',
        'inverse-on-surface': '#09090b',
        outline: '#3f3f46', // zinc-700
        'outline-variant': '#27272a', // zinc-800
        
        // Primary - Electric/Subdued Blue
        primary: '#3b82f6', // blue-500
        'on-primary': '#ffffff',
        'primary-container': '#1d4ed8', // blue-700
        'on-primary-container': '#eff6ff',
        
        // Secondary - Slate/Gray
        secondary: '#e4e4e7', // zinc-200
        'on-secondary': '#18181b',
        'secondary-container': '#27272a',
        'on-secondary-container': '#e4e4e7',
        
        // Tertiary - Subtle Emerald for success
        tertiary: '#10b981', // emerald-500
        'on-tertiary': '#ffffff',
        'tertiary-container': '#047857', // emerald-700
        'on-tertiary-container': '#ecfdf5',
        
        error: '#ef4444',
        'on-error': '#ffffff',
        'error-container': '#b91c1c',
        'on-error-container': '#fef2f2',
        
        'surface-variant': '#27272a',
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      backdropBlur: {
        xs: '2px',
        glass: '8px',
        heavy: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        glass: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        glow: '0 0 0 1px rgba(59, 130, 246, 0.5), 0 0 12px rgba(59, 130, 246, 0.2)',
        'glow-sm': '0 0 0 1px rgba(59, 130, 246, 0.3)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
