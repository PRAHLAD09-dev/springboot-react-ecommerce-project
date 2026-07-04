/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Lexend", "Inter", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#EEF1FF",
          100: "#E0E4FF",
          200: "#C7CDFF",
          300: "#A5AEFF",
          400: "#8186FA",
          500: "#635BFF",
          600: "#4F3DE8",
          700: "#4230C4",
          800: "#372AA0",
          900: "#2C2380",
          950: "#1B1550",
        },
        ink: {
          50: "#F8F9FB",
          100: "#F1F3F7",
          200: "#E4E7EE",
          300: "#D2D7E2",
          400: "#A7AEC0",
          500: "#7A8299",
          600: "#5A6178",
          700: "#414759",
          800: "#282C3B",
          900: "#15171F",
          950: "#0B0C11",
        },
        success: { 50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 400: "#34D399", 500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#064E3B" },
        warning: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F" },
        danger:  { 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA", 300: "#FCA5A5", 400: "#F87171", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 800: "#991B1B", 900: "#7F1D1D" },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 17, 26, 0.04)",
        sm: "0 1px 3px 0 rgba(15, 17, 26, 0.06), 0 1px 2px -1px rgba(15, 17, 26, 0.04)",
        card: "0 2px 8px -2px rgba(15, 17, 26, 0.08), 0 1px 2px -1px rgba(15, 17, 26, 0.04)",
        md: "0 8px 24px -8px rgba(15, 17, 26, 0.12)",
        lg: "0 16px 40px -12px rgba(15, 17, 26, 0.16)",
        xl: "0 24px 60px -16px rgba(15, 17, 26, 0.20)",
        glow: "0 0 0 4px rgba(99, 91, 255, 0.12)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fadeIn 0.35s ease-out both",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-down": "slideDown 0.25s ease-out both",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
}
