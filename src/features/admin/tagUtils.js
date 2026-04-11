// tagUtils.js

// Paleta de clases predefinidas de Tailwind para reciclar
export const TAG_PALETTES = [
    { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500' },
    { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', dot: 'bg-pink-500' },
    { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', dot: 'bg-cyan-500' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', dot: 'bg-indigo-500' },
];

export const DEFAULT_TAG_STYLE = { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };

// Casos explícitos duros definidos por la app (los originales)
const EXPLICIT_STYLES = {
    'Sin etiqueta': DEFAULT_TAG_STYLE,
    'VIP': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-400' },
    'Nuevo': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    'Recurrente': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-400' },
    'Mayorista': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-400' },
    'Problemático': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-400' }
};

// Dada una etiqueta de texto, genera el estilo correspondiente de manera determinista (basado en hashing simple)
export const getTagStyle = (tagName) => {
    if (!tagName) return DEFAULT_TAG_STYLE;
    
    // 1. Verificamos explícitamente primero si está predefinida
    const explicit = EXPLICIT_STYLES[tagName];
    if (explicit) return explicit;

    // 2. Hash rápido y determinista
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 3. Modulo de la longitud de la paleta
    const index = Math.abs(hash) % TAG_PALETTES.length;
    return TAG_PALETTES[index];
};

export const getAllSystemTags = (customers) => {
    const predefined = Object.keys(EXPLICIT_STYLES);
    const usedTags = customers.flatMap(c => c.tags || []);
    // Combinamos las predeterminadas con las creadas y quitamos los duplicados.
    const all = new Set([...predefined, ...usedTags]);
    return Array.from(all);
};
