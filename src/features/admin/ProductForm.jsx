import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';
import { ImagePlus, Save } from 'lucide-react';

export default function ProductForm({ productId: propProductId, onClose, onSaved, onDirtyChange, formId }) {
    const { id: paramId } = useParams();
    const id = propProductId ?? paramId;
    const isEditMode = Boolean(id);
    const isSidebarMode = Boolean(onClose);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(isEditMode);
    
    // El esquema de datos del CMS
    const [formData, setFormData] = useState({
        name: '',
        category: 'Unisex',
        family: 'Amaderado', // Familia olfativa base
        notes: '',
        description: '',
        price: '',
        currency: 'CRC',
        ml: '100', // Valor por defecto común en perfumes
        stock: 'Disponible',
        isFeatured: false,
        quantity: 0
    });
    
    // Manejo de imágenes (Portada y Galería)
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null); // URL vieja mostrada como preview de portada

    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]); 
    const [oldGalleryUrls, setOldGalleryUrls] = useState([]);

    const initialDataRef = useRef(null);
    const dirtyInitRef = useRef(false);

    // Familias Olfativas disponibles (Misma que en la tienda)
    const FAMILIES = ['Amaderado', 'Floral', 'Cítrico', 'Dulce', 'Acuático', 'Oriental', 'Cuero'];

    // Si es edición, cargar el producto por ID al montar
    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const data = await getProductById(id);
                    if (data) {
                        setFormData({
                            name: data.name || '',
                            category: data.category || 'Unisex',
                            family: data.family || 'Amaderado',
                            notes: data.notes || '',
                            description: data.description || '',
                            price: data.price || '',
                            currency: data.currency || 'USD',
                            ml: data.ml || '100',
                            stock: data.stock || 'Disponible',
                            isFeatured: data.isFeatured || false,
                            quantity: data.quantity ?? 0
                        });
                        
                        // Cargar portada principal
                        if (data.coverImage || data.imageUrl) {
                            setCoverPreview(data.coverImage || data.imageUrl);
                        }
                        
                        // Cargar galería preexistente
                        if (data.galleryImages && Array.isArray(data.galleryImages)) {
                            setOldGalleryUrls(data.galleryImages);
                            setGalleryPreviews(data.galleryImages);
                        }
                    } else {
                        toast.error('Producto no encontrado en la base de datos');
                        navigate('/admin/inventory');
                    }
                } catch (error) {
                    toast.error('Error al cargar la información del producto');
                } finally {
                    setIsFetchingInfo(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode, navigate]);

    // Snapshot inicial para detectar cambios
    useEffect(() => {
        if (!isFetchingInfo && !dirtyInitRef.current) {
            initialDataRef.current = JSON.stringify(formData);
            dirtyInitRef.current = true;
        }
    }, [isFetchingInfo, formData]);

    // Notificar al padre si hay cambios sin guardar
    useEffect(() => {
        if (!onDirtyChange || !initialDataRef.current) return;
        const dirty = JSON.stringify(formData) !== initialDataRef.current
            || Boolean(coverFile)
            || galleryFiles.length > 0;
        onDirtyChange(dirty);
    }, [formData, coverFile, galleryFiles, onDirtyChange]);

    // Manejador genérico de campos de texto
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Manejador Portada Principal
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // Manejador Galería Múltiple
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Unir a archivos nuevos en estado (para subida)
            setGalleryFiles(prev => [...prev, ...files]);
            
            // Generar previsualizaciones de las nuevas subidas para la interfaz
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // Remover imagen de galería por índice temporal
    const removeGalleryPreview = (index) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        setOldGalleryUrls(prevOld => {
            if (index < prevOld.length) {
                // Es una imagen vieja pre-existente
                return prevOld.filter((_, i) => i !== index);
            } else {
                // Es un archivo nuevo. Ocurre fuera de prevOld, usamos callback the setGalleryFiles
                setGalleryFiles(prevFiles => {
                    const fileIndex = index - prevOld.length;
                    return prevFiles.filter((_, i) => i !== fileIndex);
                });
                return prevOld;
            }
        });
    };

    // Enviar el formulario a Base de datos (Crear o Actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.name) return toast.warn("Por favor añade un nombre.");
        if (!isEditMode && !coverFile && !coverPreview) return toast.warn("Sube al menos la Imagen de Portada Principal.");

        try {
            setIsLoading(true);
            const cleanData = { ...formData, price: Number(formData.price) || 0 };

            if (isEditMode) {
                await updateProduct(id, cleanData, coverFile, coverPreview, galleryFiles, oldGalleryUrls);
                toast.success('¡Producto actualizado!');
            } else {
                await createProduct(cleanData, coverFile, galleryFiles);
                toast.success('¡Producto guardado!');
            }
            onDirtyChange?.(false);
            if (isSidebarMode) { onSaved?.(); } else { navigate('/admin/inventory'); }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingInfo) {
        return <div className="text-gray-400 animate-pulse p-6">Cargando producto...</div>;
    }

    return (
        <div className={isSidebarMode ? '' : 'max-w-4xl mx-auto'}>
            {!isSidebarMode && (
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Completa los detalles de esta fragancia.</p>
                    </div>
                    <button onClick={() => navigate('/admin/inventory')} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm border border-gray-300 dark:border-white/10 px-4 py-2 rounded-lg transition-colors">
                        Volver
                    </button>
                </header>
            )}

            <form id={formId} onSubmit={handleSubmit} className="space-y-5">
                
                {/* Switch DESTACADO */}
                <div className="flex items-center gap-3 bg-white dark:bg-[#1A1A1B] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Destacar en portada y colecciones</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Ej. Oud Mystique" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Género</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white">
                            <option value="Unisex">Unisex</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Familia Olfativa</label>
                        <select name="family" value={formData.family} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white">
                            {FAMILIES.map(fam => <option key={fam} value={fam}>{fam}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas Olfativas</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Ej. Madera de oud · Ámbar · Sándalo" />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y min-h-[120px]" placeholder="Descripción de la fragancia..." />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio *</label>
                        <div className="flex gap-2">
                            <select name="currency" value={formData.currency} onChange={handleChange} className="border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white shrink-0">
                                <option value="CRC">₡ CRC</option>
                                <option value="USD">$ USD</option>
                            </select>
                            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder={formData.currency === 'CRC' ? '45000' : '89.99'} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white">
                            <option value="Disponible">Disponible</option>
                            <option value="Agotado">Agotado</option>
                            <option value="Bóveda (Retirado)">Retirado (Oculto)</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unidades en stock</label>
                        <p className="text-xs text-gray-400">Solo visible en el panel de administración, no se muestra al cliente.</p>
                        <input type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="0" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contenido (ml)</label>
                        <div className="relative">
                            <input type="number" name="ml" value={formData.ml} onChange={handleChange} className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-[#111113] text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="100" />
                            <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">ml</span>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Imágenes</p>

                        <div className="bg-gray-50 dark:bg-[#1A1A1B] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Portada Principal *</label>
                            <p className="text-xs text-indigo-500 mb-3">Esta imagen se muestra en la sección Tienda y en los resultados del catálogo.</p>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {coverPreview
                                        ? <img src={coverPreview} alt="Portada" className="w-full h-full object-contain" />
                                        : <ImagePlus className="w-6 h-6 text-gray-300" />
                                    }
                                </div>
                                <div className="flex-1">
                                    <input type="file" accept="image/*" onChange={handleCoverChange} className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-[#1A1A1B] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Galería (carrusel de detalles)</label>
                            <p className="text-xs text-indigo-500 mb-3">Estas imágenes sólo se muestran al abrir el detalle del producto en la tienda.</p>
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer mb-3" />
                            {galleryPreviews.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {galleryPreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                            <img src={src} alt={`Galería ${i}`} className="w-full h-full object-contain" />
                                            <button type="button" onClick={() => removeGalleryPreview(i)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-6 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">Sin imágenes en la galería</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!isSidebarMode && (
                    <div className="pt-5 mt-2 border-t border-gray-200 dark:border-white/5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/inventory')}
                            disabled={isLoading}
                            className="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors font-medium border border-gray-200 dark:border-white/10 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 text-white px-6 py-2.5 text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando...</>
                            ) : (
                                isEditMode ? 'Actualizar' : 'Guardar producto'
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
