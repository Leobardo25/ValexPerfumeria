/**
 * VALEX Perfumería — Constants
 * Centralized data for the landing page.
 * Prepared for future integration with Admin Panel.
 */

export const NAV_LINKS = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#colecciones', label: 'Colecciones' },
    { href: '#nosotros', label: 'Sobre Nosotros' },
    { href: '#contacto', label: 'Contacto' },
]

export const HERO_CONTENT = {
    title: 'El Arte de Oler Increíble',
    subtitle: 'Descubra fragancias exclusivas diseñadas para cautivar',
    cta: 'Ver Catálogo',
    ctaHref: '#colecciones',
}

export const HERO_STATS = [
    { value: '50+', label: 'Fragancias' },
    { value: '2K+', label: 'Clientes' },
    { value: '8+', label: 'Años' },
]

export const PRODUCTS = [
    {
        id: 'oud-mystique',
        name: 'Oud Mystique',
        category: 'Masculino',
        notes: 'Madera de oud · Ámbar · Sándalo',
        description: 'Una fragancia intensa y envolvente que evoca la profundidad de los bosques orientales.',
    },
    {
        id: 'velvet-rose',
        name: 'Velvet Rose',
        category: 'Femenino',
        notes: 'Rosa damascena · Peonía · Almizcle',
        description: 'Elegancia atemporal en cada gota. Un bouquet floral sofisticado y sensual.',
    },
    {
        id: 'citrus-aura',
        name: 'Citrus Aura',
        category: 'Unisex',
        notes: 'Bergamota · Limón · Vetiver',
        description: 'Frescura mediterránea para espíritus libres. Luminoso, vibrante y cautivador.',
    },
]

export const MOODBOARD_IMAGES = [
    { id: 'mood-ingredients', alt: 'Ingredientes premium de perfumería artesanal' },
    { id: 'mood-crystal', alt: 'Detalle de frasco de cristal con reflejos dorados' },
    { id: 'mood-scene', alt: 'Escena minimalista de perfumes de lujo' },
]

export const BRAND = {
    name: 'VALEX',
    tagline: 'Perfumería de Autor',
    description: 'Fragancias exclusivas para quienes entienden que el aroma es la firma más íntima del estilo.',
    copyright: `© ${new Date().getFullYear()} VALEX Perfumería. Todos los derechos reservados.`,
}
