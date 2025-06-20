/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep backgrounds
        'bg-primary': '#050510',
        'bg-secondary': '#12121a',
        'bg-tertiary': '#1a1a25',
        
        // Glass effects
        'glass': {
          'light': 'rgba(255, 255, 255, 0.03)',
          'medium': 'rgba(255, 255, 255, 0.05)',
          'heavy': 'rgba(255, 255, 255, 0.08)',
          'border': 'rgba(255, 255, 255, 0.06)',
        },
        
        // Accent colors
        'accent-blue': '#4a9eff',
        'accent-glow': '#6bb6ff',
        'accent-deep': '#2563eb',
        
        // Text hierarchy
        'text-primary': '#ffffff',
        'text-secondary': '#8b92a4',
        'text-tertiary': '#6b7280',
      },
      
      boxShadow: {
        'glow': '0 0 40px rgba(74, 158, 255, 0.3)',
        'glow-lg': '0 0 60px rgba(74, 158, 255, 0.4)',
        'glow-sm': '0 0 20px rgba(74, 158, 255, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(74, 158, 255, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      
      dropShadow: {
        'glow': '0 0 10px rgba(74, 158, 255, 0.5)',
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
        xl: '40px',
      },
      
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-up': 'scale-up 0.2s ease-out',
      },
      
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}