import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        // WedStay Sophisticated Black/White Design System
        // NO purple, NO gradients, NO AI patterns

        // Pure blacks and whites
        black: '#000000',
        white: '#FFFFFF',

        // Sophisticated neutral scale
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },

        // Semantic colors (no purple!)
        background: 'hsl(0 0% 100%)', // Pure white
        foreground: 'hsl(0 0% 0%)', // Pure black

        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 0%)',
        },

        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 0%)',
        },

        // Primary = Black
        primary: {
          DEFAULT: 'hsl(0 0% 0%)',
          foreground: 'hsl(0 0% 100%)',
        },

        // Secondary = Stone
        secondary: {
          DEFAULT: 'hsl(24 6% 90%)',
          foreground: 'hsl(0 0% 0%)',
        },

        muted: {
          DEFAULT: 'hsl(24 6% 97%)',
          foreground: 'hsl(24 6% 30%)',
        },

        // Accent = Dark stone (NOT purple)
        accent: {
          DEFAULT: 'hsl(24 6% 10%)',
          foreground: 'hsl(0 0% 100%)',
        },

        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(0 0% 100%)',
        },

        border: 'hsl(24 6% 90%)',
        input: 'hsl(24 6% 90%)',
        ring: 'hsl(0 0% 0%)',

        // Chart colors (sophisticated monochrome)
        chart: {
          '1': 'hsl(0 0% 10%)',
          '2': 'hsl(0 0% 30%)',
          '3': 'hsl(0 0% 50%)',
          '4': 'hsl(0 0% 70%)',
          '5': 'hsl(0 0% 85%)',
        },
      },

      borderRadius: {
        // Minimal, professional radius (not overly rounded)
        lg: '4px',
        md: '3px',
        sm: '2px',
        none: '0',
      },

      boxShadow: {
        // Refined shadows, not dramatic
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        none: 'none',
      },

      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(0 0% 0%)',
            '--tw-prose-headings': 'hsl(0 0% 0%)',
            '--tw-prose-links': 'hsl(0 0% 0%)',
            '--tw-prose-bold': 'hsl(0 0% 0%)',
            '--tw-prose-counters': 'hsl(24 6% 40%)',
            '--tw-prose-bullets': 'hsl(24 6% 60%)',
            '--tw-prose-quotes': 'hsl(0 0% 0%)',
            '--tw-prose-code': 'hsl(0 0% 0%)',
          },
        },
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
