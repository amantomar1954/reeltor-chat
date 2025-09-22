import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Essential layout classes
    'h-screen', 'w-full', 'flex', 'flex-col', 'flex-1', 'relative', 'absolute', 'overflow-hidden',
    'items-center', 'justify-between', 'space-x-2', 'space-x-3', 'flex-shrink-0',
    // Background colors and custom backgrounds
    'bg-white', 'bg-gray-100', 'bg-gray-200', 'bg-gray-400', 'bg-green-50', 'bg-red-50', 'bg-yellow-50',
    'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-[#ededed]', 'bg-green-100', 'bg-red-100',
    // Text colors and custom text colors
    'text-green-600', 'text-red-600', 'text-yellow-600', 'text-gray-600', 'text-gray-400',
    'text-[#25D366]', 'text-lg', 'text-sm', 'text-xs', 'font-medium', 'leading-relaxed',
    // Spacing
    'p-2', 'p-3', 'p-4', 'px-2', 'px-3', 'py-1', 'py-2', 'm-2', 'gap-2', 'pr-12',
    // Borders and shapes
    'border-b', 'border-green-200', 'border-red-200', 'border-yellow-200', 'rounded-full',
    // Animation
    'animate-pulse',
    // Sizing
    'w-2', 'h-2', 'w-80', 'size-16', 'size-20',
    // Position utilities
    'z-50', 'shadow-lg',
    // Hover states
    'hover:bg-red-200', 'hover:bg-gray-200',
    // Transitions
    'transition-colors',
    // Hide/show utilities
    'hidden', 'block',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
