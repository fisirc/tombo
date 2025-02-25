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
        danger:   "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      },
      backgroundColor: {
        default:    "var(--color-bg-default)",
        foreground: {
          DEFAULT:  "var(--color-bg-foreground)",
          extra:    "var(--color-bg-foreground-extra)",
          mild:     "var(--color-bg-foreground-mild)",
        },
        deep:       "var(--color-bg-deep)",
        inverse: {
          DEFAULT:  "var(--color-bg-inverse)",
          mild:     "var(--color-bg-inverse-mild)",
        },
      },
      textColor: {
        default: "var(--color-text-default)",
        muted:   "var(--color-text-muted)",
        inverse: "var(--color-text-inverse)",
      },
    }
  },
}
