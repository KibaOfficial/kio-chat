// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--kio-primary, #0099ff)",
        accent: "var(--kio-accent, #2563eb)",
        highlight: "var(--kio-highlight, #60a5fa)",
        bgdark: "var(--kio-bg-dark, #0a174e)",
        white: "var(--kio-white, #ffffff)",
        graylight: "var(--kio-gray-light, #f1f5f9)",
        gray: "var(--kio-gray, #cbd5e1)",
        success: "var(--kio-success, #57F287)",
        error: "var(--kio-error, #ED4245)",
      },
      animation: {
        'neon-glow': 'neon-glow 1.5s ease-in-out infinite alternate',
      }
    }
  }
}