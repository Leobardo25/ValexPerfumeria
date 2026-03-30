/** @type {import('tailwindcss').Config} */

/*
 * ========================================
 *  🎨 VALEX PERFUMERÍA — THEME
 *  Concepto: "Lujo Silencioso"
 * ========================================
 *  Paleta de colores:
 *  ─────────────────
 *  Negro Mate    #1A1A1B  (fondos, texto base)
 *  Bronce        #A68966  (acentos, logo, CTAs)
 *  Gris Piedra   #D1D1D1  (texto secundario, bordes)
 *  Blanco Hueso  #F5F5F5  (secciones de respiro)
 * ========================================
 */

const THEME = {
    negro: '#1A1A1B',
    bronce: '#A68966',
    grisPiedra: '#D1D1D1',
    blancoHueso: '#F5F5F5',
}

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic tokens — Lujo Silencioso
                'valex-negro': THEME.negro,
                'valex-bronce': THEME.bronce,
                'valex-gris': THEME.grisPiedra,
                'valex-hueso': THEME.blancoHueso,

                // Functional aliases
                'valex-bronce-dark': '#8A7050',
                'valex-bronce-light': '#C4A87D',
                'valex-negro-alt': '#222223',
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Poppins', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
