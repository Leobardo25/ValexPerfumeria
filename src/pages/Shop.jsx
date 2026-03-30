import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../services/productService';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { VALEX_TRANSITION } from '../constants/motion';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Al entrar a la tienda física, el scroll siempre arriba
        window.scrollTo(0, 0);
        const fetchStore = async () => {
            try {
                const data = await getProducts();
                // Filtrar los que no están retirados (Bóveda)
                setProducts(data.filter(p => p.stock !== 'Bóveda (Retirado)'));
            } catch (error) {
                console.error("Error al cargar la tienda", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    // Separamos en categorías por si en el futuro quieres hacer pestañas, por ahora mostramos todos juntos
    return (
        <div className="bg-valex-negro min-h-screen font-sans text-valex-hueso flex flex-col">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            
            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header de la tienda */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={VALEX_TRANSITION}
                        className="text-center mb-16"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-valex-hueso mb-4">La Colección Completa</h1>
                        <p className="text-valex-gris max-w-2xl mx-auto text-lg font-light">
                            Explora nuestro catálogo íntegro de fragancias de autor. Cada botella encierra un relato profundo y un estilo inconfundible.
                        </p>
                    </motion.div>

                    {/* Grilla de Productos */}
                    {loading ? (
                       <div className="flex flex-col items-center justify-center py-24">
                           <div className="w-12 h-12 border-4 border-valex-hueso/20 border-t-valex-hueso rounded-full animate-spin"></div>
                           <p className="mt-4 text-valex-gris font-serif italic text-lg animate-pulse">Destilando catálogo...</p>
                       </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 border border-valex-gris/10 rounded-2xl bg-[#1e1e1f]">
                            <p className="text-valex-gris text-xl font-serif">La bodega está temporalmente vacía.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product, index) => (
                                <motion.div 
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ ...VALEX_TRANSITION, delay: index * 0.1 }}
                                    className="group cursor-pointer relative"
                                >
                                    {/* Etiqueta de Agotado */}
                                    {product.stock === 'Agotado' && (
                                        <div className="absolute top-4 left-4 z-10 bg-valex-negro/90 backdrop-blur-md text-valex-hueso text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border border-valex-gris/20">
                                            Agotado Temporalmente
                                        </div>
                                    )}

                                    {/* Imagen (Frasco) */}
                                    <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#1A1A1B] border border-valex-gris/10 relative">
                                        {/* Luz de fondo sutil */}
                                        <div className="absolute inset-x-0 -bottom-32 h-64 bg-valex-bronce/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                        
                                        {product.imageUrl ? (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 ${product.stock === 'Agotado' ? 'grayscale opacity-70' : ''}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-valex-gris/30 font-serif italic">Fotografía en proceso</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Info Panel Inferior */}
                                    <div className="mt-6 flex flex-col items-center text-center">
                                        <div className="text-xs font-sans tracking-[0.2em] text-valex-gris uppercase mb-2">
                                            {product.category}
                                        </div>
                                        <h3 className="font-serif text-2xl text-valex-hueso group-hover:text-valex-bronce transition-colors duration-500 mb-2">
                                            {product.name}
                                        </h3>
                                        {product.notes && (
                                            <p className="text-sm font-sans text-valex-gris mb-4 line-clamp-1 w-full px-4">
                                                {product.notes}
                                            </p>
                                        )}
                                        {/* Precio (Si existe) */}
                                        {product.price && Number(product.price) > 0 && (
                                            <p className="font-sans font-medium text-valex-bronce text-lg tracking-wide">
                                                ${Number(product.price).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
