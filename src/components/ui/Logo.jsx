import React from 'react';

// Nuevo diseño del Logo: "V" (Grande), "A" (Mediana), "lex" (Pequeña), 
// todo con tipografía de Lujo (Playfair Display) y la animación dorada fluida.
export default function Logo({ className = "" }) {
    return (
        <span className={`font-serif animate-shimmer inline-block pt-1 pb-1 ${className}`} style={{ fontFamily: '"Playfair Display", serif' }}>
            <span className="text-[1.8em] font-normal tracking-normal" style={{ verticalAlign: 'baseline' }}>V</span>
            <span className="text-[1.3em] font-light -ml-[0.1em]" style={{ verticalAlign: 'baseline' }}>A</span>
            <span className="text-[0.85em] lowercase font-light tracking-[0.2em] ml-[1px]" style={{ verticalAlign: 'baseline' }}>lex</span>
        </span>
    );
}
