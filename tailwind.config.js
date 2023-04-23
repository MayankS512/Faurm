/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        // Static Utility to Apply Both Underline & Strikethrough
        ".underline-through": {
          "text-decoration-line": "underline line-through",
        },
      });
    }),
  ],
};
