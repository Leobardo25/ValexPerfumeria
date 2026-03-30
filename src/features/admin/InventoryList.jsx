import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function InventoryList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Error cargando inventario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente '${name}'?`)) {
            try {
                await deleteProduct(id);
                toast.success(`Producto '${name}' eliminado.`);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                toast.error("Error al eliminar el producto");
            }
        }
    };

    // Filtro simple en el cliente
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8 md:flex items-center justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-serif text-valex-hueso">Inventario Maestro</h2>
                    <p className="text-valex-gris mt-1 font-sans text-sm">Gestiona tu catálogo de fragancias y notas exclusivas.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-valex-gris/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Buscar resina, madera..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#1e1e1f] border border-valex-gris/20 text-valex-hueso rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-valex-bronce transition-colors"
                        />
                    </div>
                    <button 
                        onClick={() => navigate('/admin/products/new')}
                        className="bg-valex-bronce text-valex-negro px-6 py-2 rounded-lg font-medium hover:bg-valex-bronce-dark transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Perfume
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-valex-hueso/20 border-t-valex-hueso rounded-full animate-spin"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#1e1e1f] border border-valex-gris/10 rounded-2xl shadow-xl">
                    <p className="text-valex-gris text-lg mb-4">No se encontraron productos en la bóveda.</p>
                    {searchTerm && <p className="text-sm text-valex-gris/60 mb-6">Prueba con otro término de búsqueda.</p>}
                    {!searchTerm && (
                        <button 
                            onClick={() => navigate('/admin/products/new')}
                            className="text-valex-bronce hover:text-valex-hueso underline tracking-widest font-sans uppercase text-sm"
                        >
                            Comenzar formulación
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-valex-gris/10 bg-[#1e1e1f] shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-valex-gris/10">
                                <th className="px-6 py-4 text-xs font-sans tracking-widest uppercase text-valex-gris font-medium">Producto</th>
                                <th className="px-6 py-4 text-xs font-sans tracking-widest uppercase text-valex-gris font-medium hidden md:table-cell">Familia</th>
                                <th className="px-6 py-4 text-xs font-sans tracking-widest uppercase text-valex-gris font-medium">Precio/Estado</th>
                                <th className="px-6 py-4 text-xs font-sans tracking-widest uppercase text-valex-gris font-medium text-center">Hero</th>
                                <th className="px-6 py-4 text-xs font-sans tracking-widest uppercase text-valex-gris font-medium text-right">Manejo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredProducts.map((p) => (
                                    <motion.tr 
                                        key={p.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b border-valex-gris/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 bg-valex-negro rounded-md overflow-hidden shrink-0 border border-valex-gris/20 flex items-center justify-center">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-valex-gris/50">Vacío</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-valex-hueso font-serif font-medium">{p.name}</p>
                                                    <p className="text-xs text-valex-gris line-clamp-1 max-w-[200px] mt-1 hidden sm:block">{p.notes}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="bg-valex-negro text-valex-gris text-xs px-3 py-1 rounded-full border border-valex-gris/10">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-valex-hueso font-medium">${Number(p.price || 0).toFixed(2)}</p>
                                            <p className={`text-xs mt-1 ${p.stock === 'Disponible' ? 'text-green-500/80' : 'text-valex-bronce/80'}`}>{p.stock || 'General'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {p.isFeatured ? (
                                                <span className="inline-flex w-3 h-3 rounded-full bg-valex-bronce shadow-[0_0_8px_var(--valex-bronce)]"></span>
                                            ) : (
                                                <span className="inline-flex w-3 h-3 rounded-full bg-valex-gris/20"></span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-valex-gris">
                                                <button 
                                                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                                                    className="p-2 hover:text-valex-bronce hover:bg-valex-bronce/10 rounded-lg transition-all" title="Editar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(p.id, p.name)}
                                                    className="p-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Retirar permanentemente"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
