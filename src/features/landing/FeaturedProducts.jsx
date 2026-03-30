import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productService'
import { fadeInUp, staggerContainer, VALEX_TRANSITION } from '../../constants/motion'

// Esta es una imagen estática de respaldo en caso de que un producto no tenga imagen
import defaultImg from '../../img/perfumeria/oud-mystique.png'

export default function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const allProducts = await getProducts();
                // Filtrar solo los marcados como "isFeatured" y que no estén retirados
                const featured = allProducts.filter(p => p.isFeatured && p.stock !== 'Bóveda (Retirado)');
                
                // Limitar a máximo 3 para mantener el diseño original simétrico
                setFeaturedProducts(featured.slice(0, 3));
            } catch (error) {
                console.error("Error cargando productos destacados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, [])

    // Si terminó de cargar y no hay productos destacados, no renderiza la sección.
    if (!loading && featuredProducts.length === 0) return null;

    return (
        <section id="colecciones" className="relative py-24 sm:py-32 bg-valex-hueso overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-valex-bronce/5 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={VALEX_TRANSITION}
                >
                    <span className="inline-block text-valex-bronce font-sans font-medium text-xs tracking-[0.25em] uppercase mb-4">
                        Colección Selecta
                    </span>
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl text-valex-negro">
                        Fragancias{' '}
                        <span className="text-valex-bronce italic">Destacadas</span>
                    </h2>
                    <p className="text-valex-negro/50 mt-4 text-base font-light max-w-lg mx-auto">
                        Cada perfume cuenta una historia. Descubra nuestras creaciones más exclusivas cuidadosamente seleccionadas de la bóveda.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-valex-bronce/30 border-t-valex-bronce rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <motion.div
                        className={`grid gap-8 lg:gap-10 ${
                            featuredProducts.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 
                            featuredProducts.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 
                            'md:grid-cols-3'
                        }`}
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </motion.div>
                )}

                <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <Link to="/tienda" className="inline-block py-3 px-8 border border-valex-bronce text-valex-bronce font-sans hover:bg-valex-bronce hover:text-valex-hueso transition-colors duration-300 tracking-widest text-sm uppercase rounded-full">
                        Ver Colección Completa
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

function ProductCard({ product }) {
    return (
        <motion.div
            variants={fadeInUp}
            transition={VALEX_TRANSITION}
            whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgba(166, 137, 102, 0.15)' }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-valex-gris/15 cursor-pointer flex flex-col h-full"
            style={{ transition: 'box-shadow 0.5s ease' }}
        >
            <div className="aspect-[4/5] overflow-hidden bg-valex-hueso shrink-0">
                <motion.img
                    src={product.imageUrl || defaultImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                />
            </div>

            <div className="p-6 sm:p-7 flex flex-col flex-1">
                <span className="inline-block text-valex-bronce font-sans text-[10px] tracking-[0.2em] uppercase font-semibold mb-2">
                    {product.category || 'Extracto'}
                </span>
                <h3 className="font-serif font-bold text-xl text-valex-negro mb-1">{product.name}</h3>
                <p className="text-valex-negro/40 text-xs font-sans tracking-wide mb-3">{product.notes}</p>
                <p className="text-valex-negro/60 text-sm leading-relaxed mb-5 font-light line-clamp-3 flex-1">{product.description}</p>
                
                <Link to="/tienda" className="inline-flex items-center gap-2 font-sans font-semibold text-xs tracking-wider uppercase text-valex-bronce hover:text-valex-bronce-dark transition-colors duration-300 group/btn mt-auto pt-4 border-t border-valex-gris/10 w-full">
                    <span>Adquirir</span>
                    {product.price && <span className="ml-auto text-valex-negro/60">${Number(product.price).toFixed(2)}</span>}
                </Link>
            </div>
        </motion.div>
    )
}
