/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['serif'],
    },
    extend: {
      colors: {
        error:   "var(--color-error)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      },
      backgroundColor: {
        default: "var(--color-bg-default)",
        card:    "var(--color-bg-card)",
        deep:    "var(--color-bg-deep)",
        inverse: "var(--color-bg-inverse)",
      },
      textColor: {
        default: "var(--color-text-default)",
        muted:   "var(--color-text-muted)",
        inverse: "var(--color-text-inverse)",
      }
    }
  },
}
