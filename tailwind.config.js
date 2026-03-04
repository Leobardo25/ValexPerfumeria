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
    primary: '#A38A52',       // Dorado hover (un poco más oscuro)
    accent: '#C6A96B',        // Dorado suave cálido (botones, íconos)
    soft: '#1C1C1C',          // Negro secundario (secciones alternas)
    softAlt: '#111111',       // Negro principal (fondo)
    dark: '#111111',          // Negro principal (fondo)
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

                // Reckless Studio specific colors
                'brand-bg': '#111111',
                'brand-dark': '#1C1C1C',
                'brand-beige': '#E6D5C3',
                'brand-gold': '#C6A96B',
                'brand-gray': '#B8B1A8',
                'brand-white': '#F5F5F5',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
