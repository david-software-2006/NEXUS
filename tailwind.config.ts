import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Coffee theme colors
        coffee: {
          50: "#FFF8DC",
          100: "#F5DEB3",
          200: "#DEB887",
          300: "#D2B48C",
          400: "#CD853F",
          500: "#D2691E",
          600: "#A0522D",
          700: "#8B4513",
          800: "#654321",
          900: "#3E2723",
        },
        // Dark mode colors
        dark: {
          100: "#E0E0E0",
          200: "#C2C2C2",
          300: "#A3A3A3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3D3D3D",
          800: "#292929",
          900: "#141414",
          950: "#0A0A0A"
        },
        // Amber/orange colors for light mode
        light: {
          50: "#FFF8F0",
          100: "#FEEFD8",
          200: "#FEE0B6",
          300: "#FDD094",
          400: "#FDC172",
          500: "#FCB150",
          600: "#E69F48",
          700: "#D08D40",
          800: "#BA7B38",
          900: "#A46930"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Animation for theme toggle
        "theme-toggle": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.2)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "theme-toggle": "theme-toggle 0.5s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      perspective: {
        "1000": "1000px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      // Extend background images for theme switching
      backgroundImage: {
        "light-gradient": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "dark-gradient": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      },
      // Box shadow for theme-specific elements
      boxShadow: {
        "light": "0 4px 6px -1px rgba(252, 177, 80, 0.1), 0 2px 4px -1px rgba(252, 177, 80, 0.06)",
        "dark": "0 4px 6px -1px rgba(10, 10, 10, 0.1), 0 2px 4px -1px rgba(10, 10, 10, 0.06)",
        "light-lg": "0 10px 15px -3px rgba(252, 177, 80, 0.1), 0 4px 6px -2px rgba(252, 177, 80, 0.05)",
        "dark-lg": "0 10px 15px -3px rgba(10, 10, 10, 0.1), 0 4px 6px -2px rgba(10, 10, 10, 0.05)"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin for smooth transitions
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.theme-transition': {
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        },
        '.theme-transition-colors': {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
        '.theme-transition-bg': {
          transition: 'background-color 0.3s ease',
        },
      })
    }
  ],
} satisfies Config

export default config