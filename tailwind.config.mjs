import animate from "tailwindcss-animate";

/** @type {import("tailwindcss").Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "28px",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          accent: "hsl(var(--accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        macaron: {
          rose: "#FFB7C5",
          "rose-light": "#FFE4E9",
          "rose-pale": "#FFF0F3",
          "rose-soft": "#FFD1DC",
          mint: "#5CB85C",
          "mint-light": "#D4F5E9",
          "mint-dark": "#2E8B57",
          lemon: "#F5D547",
          "lemon-light": "#FFFBE0",
          "lemon-dark": "#B8860B",
          lavender: "#E0BBE4",
          "lavender-light": "#F0E0F2",
          peach: "#FFDAC1",
          "peach-light": "#FFF0E5",
          periwinkle: "#C7CEEA",
          "periwinkle-light": "#E0E4F5",
          vanilla: "#FFFCFD",
          shell: "#F7F5F0",
          "milk-tea": "#E8E4E0",
          cocoa: "#A89F91",
          "text-primary": "#5C5552",
          "text-secondary": "#A89F91",
        },
      },
      fontFamily: {
        sans: ["Nunito", "Quicksand", "Varela Round", "system-ui", "sans-serif"],
        display: ["Quicksand", "Nunito", "sans-serif"],
        mono: ["SF Mono", "Menlo", "Monaco", "Courier New", "monospace"],
        hand: ["Pacifico", "Dancing Script", "cursive"],
      },
      boxShadow: {
        "macaron-sm": "0 2px 8px rgba(168, 159, 145, 0.08)",
        "macaron-md": "0 4px 12px rgba(168, 159, 145, 0.10)",
        "macaron-lg": "0 8px 24px rgba(168, 159, 145, 0.12)",
        "macaron-xl": "0 12px 32px rgba(168, 159, 145, 0.14)",
        "macaron-pink": "0 4px 12px rgba(255, 183, 197, 0.25)",
        "macaron-mint": "0 4px 12px rgba(181, 234, 215, 0.25)",
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
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "70%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pop-in": "pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
