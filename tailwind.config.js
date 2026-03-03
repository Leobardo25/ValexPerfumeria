/** @type {import('tailwindcss').Config} */

/*
 * ========================================
 *  🎨 THEME CONFIGURATION
 * ========================================
 *  To change the entire app's color scheme,
 *  just modify the colors below. All components
 *  use these semantic names, so changing them
 *  here will update the ENTIRE app instantly.
 *
 *  EXAMPLE THEMES:
 *  ───────────────
 *  🟣 Purple (current):
 *     primary: '#4B0082', accent: '#8A2BE2'
 *
 *  🔵 Blue:
 *     primary: '#1e3a5f', accent: '#3b82f6'
 *
 *  🔴 Red:
 *     primary: '#7f1d1d', accent: '#dc2626'
 *
 *  🟢 Green:
 *     primary: '#14532d', accent: '#22c55e'
 *
 *  🟡 Gold:
 *     primary: '#78350f', accent: '#f59e0b'
 * ========================================
 */

// ⬇️ CHANGE THESE TO SWITCH THE ENTIRE THEME ⬇️
const THEME = {
    primary: '#B8860B',       // Dark gold
    accent: '#D4AF37',        // Gold vibrante
    soft: '#E6E6FA',          // Fondo claro (lavender) original
    softAlt: '#F3F0FF',       // Fondo claro alternativo
    dark: '#000000',          // Negro puro absoluto (Hero, Footer)
}

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-purple': THEME.primary,
                'electric-purple': THEME.accent,
                'lavender': THEME.soft,
                'lavender-soft': THEME.softAlt,
                'charcoal': THEME.dark,
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
