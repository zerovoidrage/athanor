import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'suisse': ['SuisseIntl', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'regular': '400',
        'book': '500',
        'medium': '600',
        'semibold': '700',
      },
      fontSize: {
        'number': ['20px', {
          lineHeight: '120%',
          letterSpacing: '-0.00em',
          fontWeight: '400',
        }],
        'largetitle': ['42px', {
          lineHeight: '120%',
          letterSpacing: '-0.01em',
          fontWeight: '400',
        }],
        'display': ['24px', {
          lineHeight: '140%',
          letterSpacing: '-0.01em',
          fontWeight: '500',
        }],
        'heading': ['20px', {
          lineHeight: '140%',
          letterSpacing: '0em',
          fontWeight: '500',
        }],
        'subheading': ['18px', {
          lineHeight: '100%',
          letterSpacing: '-0.00em',
          fontWeight: '400',
        }],
        'subheading2': ['16px', {
          lineHeight: '100%',
          letterSpacing: '-0.00em',
          fontWeight: '400',
        }],
        'body': ['15px', {
          lineHeight: '140%',
          letterSpacing: '0em',
          fontWeight: '400',
        }],
        'callout': ['15px', {
          lineHeight: '140%',
          letterSpacing: '0em',
          fontWeight: '500',
        }],
        'caption': ['14px', {
          lineHeight: '140%',
          letterSpacing: '0em',
          fontWeight: '500',
        }],
        'small': ['13px', {
          lineHeight: '140%',
          letterSpacing: '0em',
          fontWeight: '400',
        }],
      },
      colors: {
        // White palette
        white: {
          500: '#1a1a1a',
          600: '#545454',
          700: 'rgba(255, 255, 255, 0.50)',
          800: '#DDDDDD',
          900: '#ffffff',
        },
        // Surface palette
        surface: {
          800: '#292929',
          900: '#000000',
        },
        // OnSurface palette
        onsurface: {
          800: 'rgba(255, 255, 255, 0.20)',
          900: 'rgba(255, 255, 255, 0.10)',
        },
        // Brand colors
        red: '#8B0000',
        coral: '#FF7F50',
        green: '#00FF7F',
        olive: '#7FFF00',
        yellow: '#FFFF7F',
      },
    },
  },
  plugins: [],
};

export default config; 