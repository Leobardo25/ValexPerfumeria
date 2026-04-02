import React from 'react';

// Nuevo diseño del Logo: "V" (Grande), "A" (Mediana), "lex" (Pequeña), 
// todo con tipografía de Lujo (Playfair Display) y la animación dorada fluida.
export default function Logo({ className = "" }) {
    return (
        <span className={`animate-shimmer inline-block pt-1 pb-1 drop-shadow-md uppercase tracking-[0.2em] font-bold text-[1.8em] ${className}`} style={{ fontFamily: '"Montserrat", sans-serif' }}>
            VALEX
        </span>
    );
}
