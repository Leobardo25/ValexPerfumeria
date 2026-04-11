export const getProductImage = (p) => p.coverImage || p.imageUrl || null;

export const formatPrice = (price, currency) => {
    if (price === undefined || price === null || price === '') return '—';
    const num = Number(price);
    if (currency === 'CRC') return `₡${num.toLocaleString('es-CR')}`;
    return `$${num.toFixed(2)}`;
};
