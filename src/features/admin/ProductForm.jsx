import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';

export default function ProductForm() {
    const { id } = useParams(); // Si hay ID en la ruta, es modo EDICION
    const isEditMode = Boolean(id);
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
        stock: 'Disponible',
        isFeatured: false
    });
    
    // Manejo de imágenes (Portada y Galería)
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null); // URL vieja mostrada como preview de portada

    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]); 
    const [oldGalleryUrls, setOldGalleryUrls] = useState([]); // Mantener estado de las imágenes viejas de la nube

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
                            stock: data.stock || 'Disponible',
                            isFeatured: data.isFeatured || false
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
        // Lógica de UI básica: remueve la previsualización por índice. No purga los Files físicamente en esta iteración.
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
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
                // oldGalleryUrls is sent so the backend merges previous gallery with new ones.
                await updateProduct(id, cleanData, coverFile, coverPreview, galleryFiles, oldGalleryUrls);
                toast.success('¡Perfume actualizado con éxito!');
            } else {
                // Creando nuevo
                await createProduct(cleanData, coverFile, galleryFiles);
                toast.success('¡Perfume añadido al catálogo!');
            }
            navigate('/admin/inventory');
        } catch (error) {
            toast.error(`Error guardando producto: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingInfo) {
        return <div className="text-valex-gris animate-pulse">Cargando base de datos...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-valex-hueso">{isEditMode ? 'Editar Perfume' : 'Añadir Nuevo Perfume'}</h2>
                    <p className="text-valex-gris font-sans text-sm mt-1">Completa los detalles de esta fragancia para el catálogo.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/inventory')}
                    className="text-valex-gris hover:text-valex-bronce text-sm border border-valex-gris/20 px-4 py-2 rounded-lg transition-colors"
                >
                    Volver al Inventario
                </button>
            </header>

            <form onSubmit={handleSubmit} className="bg-[#1e1e1f] border border-valex-gris/10 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
                
                {/* Switch DESTACADO */}
                <div className="flex items-center gap-4 bg-valex-bronce/10 p-4 rounded-xl border border-valex-bronce/20 mb-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-valex-negro rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-valex-gris after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-valex-bronce"></div>
                        <span className="ml-3 text-sm font-medium text-valex-hueso">Destacar en la Portada (Hero Section / Colecciones)</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label className="text-valex-gris text-sm font-medium">Nombre de la Fragancia *</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors" placeholder="Ej. Oud Mystique" />
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                        <label className="text-valex-gris text-sm font-medium">Categoría / Género</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors">
                            <option value="Unisex">Unisex</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>

                    {/* Familia Olfativa */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-valex-gris text-sm font-medium">Familia Olfativa Principal</label>
                        <select name="family" value={formData.family} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors">
                            {FAMILIES.map(fam => (
                                <option key={fam} value={fam}>{fam}</option>
                            ))}
                        </select>
                    </div>

                    {/* Notas (Acordes) */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-valex-gris text-sm font-medium">Notas Olfativas Principales</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors" placeholder="Ej. Madera de oud · Ámbar · Sándalo" />
                    </div>

                    {/* Descripción Larga */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-valex-gris text-sm font-medium">Descripción Literaria</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors resize-none" placeholder="Cuenta la historia e inspiración emocional de esta fragancia..." />
                    </div>

                    {/* Precio */}
                    <div className="space-y-2">
                        <label className="text-valex-gris text-sm font-medium">Precio Exclusivo (Opcional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-valex-gris">$</span>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors" placeholder="0.00" />
                        </div>
                    </div>

                    {/* Inventario/Stock */}
                    <div className="space-y-2">
                        <label className="text-valex-gris text-sm font-medium">Estado del Producto</label>
                        <select name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-valex-negro border border-valex-gris/20 text-valex-hueso rounded-lg px-4 py-3 focus:outline-none focus:border-valex-bronce transition-colors">
                            <option value="Disponible">Disponible (En Stock)</option>
                            <option value="Agotado">Agotado Temporalmente</option>
                            <option value="Bóveda (Retirado)">En la Bóveda (Oculto)</option>
                        </select>
                    </div>

                    {/* Sección Multimedia (Portada y Galería) */}
                    <div className="space-y-6 md:col-span-2 mt-4 pt-6 border-t border-valex-gris/10">
                        <h3 className="text-lg font-serif text-valex-hueso">Archivos Multimedia</h3>
                        
                        {/* Imagen Principal (Portada) */}
                        <div className="bg-valex-negro/50 p-6 rounded-xl border border-valex-gris/10">
                            <label className="text-valex-gris text-sm font-medium mb-3 block">Imagen de Portada Principal *</label>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-32 h-40 bg-valex-negro border-2 border-dashed border-valex-gris/20 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-valex-gris/40 text-xs text-center px-2">Sin Portada</span>
                                    )}
                                </div>
                                <div className="flex-1 w-full">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleCoverChange}
                                        className="block w-full text-sm text-valex-gris file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-valex-bronce file:text-valex-negro hover:file:bg-valex-bronce/90 file:cursor-pointer transition-all"
                                    />
                                    <p className="text-xs text-valex-gris mt-2">Ésta imagen aparecerá en la página principal y búsquedas.</p>
                                </div>
                            </div>
                        </div>

                        {/* Imágenes de Galería Múltiple */}
                        <div className="bg-valex-negro/50 p-6 rounded-xl border border-valex-gris/10">
                            <label className="text-valex-gris text-sm font-medium mb-3 block">Imágenes de la Galería (Carrusel de Detalles)</label>
                            
                            <div className="flex-1 w-full mb-6">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="block w-full text-sm text-valex-gris file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-valex-hueso hover:file:bg-valex-gris/20 file:cursor-pointer transition-all"
                                />
                                <p className="text-xs text-valex-gris mt-2">Puedes seleccionar múltiples archivos a la vez. Aparecerán listadas abajo.</p>
                            </div>

                            {/* Previsualización en mini-cuadrícula */}
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {galleryPreviews.map((previewSrc, index) => (
                                        <div key={index} className="relative aspect-[3/4] bg-valex-negro border border-valex-gris/20 rounded-lg overflow-hidden group">
                                            <img src={previewSrc} alt={`Gallery Preview ${index}`} className="w-full h-full object-cover" />
                                            {/* Nota: Lógica simple de borrado para el preview visual */}
                                            <button 
                                                type="button" 
                                                onClick={() => removeGalleryPreview(index)}
                                                className="absolute top-1 right-1 bg-red-500/80 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {galleryPreviews.length === 0 && (
                                <div className="w-full py-8 border-2 border-dashed border-valex-gris/20 rounded-xl flex items-center justify-center">
                                    <span className="text-valex-gris/40 text-sm">Sin imágenes en la galería</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-4 border-t border-valex-gris/10 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/inventory')}
                        disabled={isLoading}
                        className="px-6 py-3 text-valex-hueso hover:bg-valex-gris/10 rounded-lg transition-colors font-medium border border-transparent disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-valex-hueso text-valex-negro px-8 py-3 rounded-lg font-medium hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <><span className="w-4 h-4 border-2 border-valex-negro/20 border-t-valex-negro rounded-full animate-spin"></span> Conectando BD...</>
                        ) : (
                            <>{isEditMode ? 'Actualizar Producto' : 'Macerar y Guardar'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
