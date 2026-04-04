import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Layout, Row, Col, Card, Button, Badge, Skeleton, Radio, Checkbox, Slider, Collapse, Typography, FloatButton, Drawer, notification, ConfigProvider, theme as antTheme, Grid, Input } from 'antd';
import { ShoppingCartOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- DICCIONARIO DE FILTROS ---
const CATEGORIES = ['Todos', 'Masculino', 'Femenino', 'Unisex'];
const FAMILIES = [
    { label: 'Amaderado', value: 'Amaderado' },
    { label: 'Floral', value: 'Floral' },
    { label: 'Cítrico', value: 'Cítrico' },
    { label: 'Dulce', value: 'Dulce' },
    { label: 'Acuático', value: 'Acuático' },
    { label: 'Oriental', value: 'Oriental' },
    { label: 'Cuero', value: 'Cuero' },
];

export default function Shop() {
    const screens = useBreakpoint();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isCompactView, setIsCompactView] = useState(() => JSON.parse(sessionStorage.getItem('valex_isCompactView') || 'false'));

    // --- ESTADO DE FILTROS ---
    const [filterCategory, setFilterCategory] = useState(() => sessionStorage.getItem('valex_category') || 'Todos');
    const [filterFamilies, setFilterFamilies] = useState(() => JSON.parse(sessionStorage.getItem('valex_families') || '[]'));
    const [filterPrice, setFilterPrice] = useState(() => JSON.parse(sessionStorage.getItem('valex_price') || '[0, 300]')); // Max price assumed $300
    const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('valex_search') || '');

    // Scroll al tope al entrar a la tienda
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Mantener estado local para no perder la navegación
    useEffect(() => {
        sessionStorage.setItem('valex_isCompactView', JSON.stringify(isCompactView));
        sessionStorage.setItem('valex_category', filterCategory);
        sessionStorage.setItem('valex_families', JSON.stringify(filterFamilies));
        sessionStorage.setItem('valex_price', JSON.stringify(filterPrice));
        sessionStorage.setItem('valex_search', searchQuery);
    }, [isCompactView, filterCategory, filterFamilies, filterPrice, searchQuery]);

    useEffect(() => {
        // Real-time setup
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filtrar productos retirados
            setProducts(rawData.filter(p => p.stock !== 'Bóveda (Retirado)'));
            setLoading(false);
        }, (error) => {
            console.error("Error al cargar en tiempo real:", error);
            setLoading(false);
            notification.error({ message: 'Error de conexión con el catálogo' });
        });

        return () => unsubscribe();
    }, []);

    // --- LÓGICA DE FILTRADO (useMemo para no re-renderizar de más) ---
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchCategory = filterCategory === 'Todos' || product.category === filterCategory;
            
            const price = Number(product.price) || 0;
            const matchPrice = price >= filterPrice[0] && price <= filterPrice[1];
            
            let matchFamily = true;
            if (filterFamilies.length > 0) {
                // filterFamilies contiene los values ej ['Amaderado', 'Oriental']
                matchFamily = filterFamilies.includes(product.family);
            }

            return matchSearch && matchCategory && matchPrice && matchFamily;
        });
    }, [products, filterCategory, filterPrice, filterFamilies, searchQuery]);

    const { addToCart } = useCart();

    // --- ACCIONES ---
    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    // --- FILTROS (useMemo para evitar re-montar durante el drag del slider) ---
    const filtersNode = useMemo(() => (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 overflow-y-auto md:overflow-hidden">
                
                {/* GÉNERO */}
                <div className="space-y-4">
                    <h3 className="text-valex-hueso font-serif tracking-widest text-lg border-b border-valex-gris/10 pb-2">GÉNERO</h3>
                    <Radio.Group 
                        className="grid grid-cols-2 gap-3 w-full" 
                        value={filterCategory} 
                        onChange={e => setFilterCategory(e.target.value)}
                    >
                        {CATEGORIES.map(cat => (
                            <Radio key={cat} value={cat} className="text-valex-gris">{cat}</Radio>
                        ))}
                    </Radio.Group>
                </div>

                {/* FAMILIA OLFATIVA */}
                <div className="space-y-4">
                    <h3 className="text-valex-hueso font-serif tracking-widest text-lg border-b border-valex-gris/10 pb-2">FAMILIA OLFATIVA</h3>
                    <Checkbox.Group 
                        className="grid grid-cols-2 gap-3 w-full"
                        options={FAMILIES.map(f => ({ label: <span className="text-valex-gris">{f.label}</span>, value: f.value }))}
                        value={filterFamilies}
                        onChange={setFilterFamilies}
                    />
                </div>

                {/* PRECIO */}
                <div className="space-y-4">
                    <h3 className="text-valex-hueso font-serif tracking-widest text-lg border-b border-valex-gris/10 pb-2">PRECIO</h3>
                    <div className="px-1 pt-2">
                        <div className="valex-range-wrap">
                            <input 
                                type="range" 
                                min={0} max={300} step={10}
                                value={filterPrice[0]} 
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val <= filterPrice[1]) setFilterPrice([val, filterPrice[1]]);
                                }}
                                className="valex-range valex-range--min"
                            />
                            <input 
                                type="range" 
                                min={0} max={300} step={10}
                                value={filterPrice[1]} 
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val >= filterPrice[0]) setFilterPrice([filterPrice[0], val]);
                                }}
                                className="valex-range valex-range--max"
                            />
                            <div className="valex-range-track">
                                <div 
                                    className="valex-range-fill"
                                    style={{
                                        left: `${(filterPrice[0] / 300) * 100}%`,
                                        right: `${100 - (filterPrice[1] / 300) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-valex-bronce text-sm mt-4 font-sans font-medium">
                            <span>${filterPrice[0]}</span>
                            <span>${filterPrice[1]}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons pinned at bottom */}
            <div className="flex-shrink-0 pt-6 pb-2 border-t border-valex-gris/10 flex gap-3">
                 <Button 
                    onClick={() => { setFilterCategory('Todos'); setFilterFamilies([]); setFilterPrice([0, 300]); setDrawerVisible(false); }} 
                    className="flex-1 h-12 bg-transparent text-valex-gris border-valex-bronce/30 hover:!border-valex-hueso hover:!text-valex-hueso font-serif tracking-widest text-xs"
                 >
                     LIMPIAR
                 </Button>
                 <Button 
                    onClick={() => setDrawerVisible(false)} 
                    className="flex-1 h-12 bg-valex-bronce text-valex-negro hover:!bg-valex-hueso hover:!text-valex-negro border-none font-serif tracking-widest text-xs font-bold"
                 >
                     APLICAR FILTROS
                 </Button>
            </div>
        </div>
    ), [filterCategory, filterFamilies, filterPrice, drawerVisible]);

    return (
        <ConfigProvider
            theme={{
                algorithm: antTheme.darkAlgorithm,
                token: {
                    colorPrimary: '#A68966',       // Bronce
                    colorBgBase: '#1A1A1B',        // Negro Mate
                    colorBgContainer: '#1e1e1f',   // Cards background
                    colorTextBase: '#F5F5F5',      // Blanco Hueso
                    colorTextSecondary: '#D1D1D1', // Gris Piedra
                    fontFamily: '"Poppins", sans-serif',
                },
                components: {
                    Collapse: { headerPadding: '12px 0px' },
                    Card: { paddingLG: 20 },
                }
            }}
        >
            <div className="min-h-screen bg-valex-negro flex flex-col">
                <Navbar 
                    menuOpen={menuOpen} 
                    setMenuOpen={setMenuOpen} 
                    shopSearchQuery={searchQuery}
                    setShopSearchQuery={setSearchQuery}
                    onToggleMobileFilters={() => setDrawerVisible(!drawerVisible)}
                    hasActiveFilters={filterCategory !== 'Todos' || filterFamilies.length > 0}
                    isFilterMenuOpen={drawerVisible}
                    mobileFiltersNode={filtersNode}
                    isCompactView={isCompactView}
                    setIsCompactView={setIsCompactView}
                />
                
                <main className="flex-1 pt-[140px] md:pt-[120px] bg-valex-negro max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="w-full h-8" />

                        {/* Contenedor Flex para Contenido Principal */}
                        <div className="flex flex-row w-full items-start">
                            
                            {/* Contenido Principal de Tarjetas */}
                            <section className="bg-transparent min-h-screen flex-1 w-full min-w-0 md:pt-4">
                                {loading ? (
                                    <Row gutter={[16, 24]}>
                                        {[1, 2, 3, 4].map(i => (
                                            <Col xs={isCompactView ? 12 : 24} sm={12} xl={8} key={i}>
                                                <Card style={{ backgroundColor: '#1e1e1f', border: '1px solid rgba(209,209,209,0.1)' }}>
                                                    <Skeleton.Image active className="w-full !h-[300px] mb-4" />
                                                    <Skeleton active paragraph={{ rows: 2 }} />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="text-center py-24 border border-valex-gris/10 rounded-2xl bg-[#1e1e1f]">
                                        <p className="text-valex-gris text-xl font-serif">No se encontraron fragancias con esta selección.</p>
                                        <Button type="link" onClick={() => { setFilterCategory('Todos'); setFilterFamilies([]); setFilterPrice([0, 300]); }}>
                                            Limpiar filtros
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {/* ── VISTA PC (hidden en móvil) ── */}
                                        <div className="hidden md:block">
                                            <Row gutter={[24, 32]}>
                                                {filteredProducts.map(product => (
                                                    <Col md={8} lg={6} key={product.id}>
                                                        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="h-full">
                                                            <CardBadgeWrap product={product}>
                                                                <DesktopCard product={product} />
                                                            </CardBadgeWrap>
                                                        </motion.div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>

                                        {/* ── VISTA MÓVIL LISTA (hidden en PC, hidden si compactView) ── */}
                                        <div className={`md:hidden ${isCompactView ? 'hidden' : 'flex flex-col gap-6'}`}>
                                            {filteredProducts.map(product => (
                                                <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                                                    <CardBadgeWrap product={product}>
                                                        <MobileCard product={product} />
                                                    </CardBadgeWrap>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* ── VISTA MÓVIL CUADRÍCULA (hidden en PC, hidden si NO compactView) ── */}
                                        <div className={`md:hidden ${isCompactView ? 'block' : 'hidden'}`}>
                                            <Row gutter={[12, 16]}>
                                                {filteredProducts.map(product => (
                                                    <Col xs={12} key={product.id}>
                                                        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="h-full">
                                                            <CardBadgeWrap product={product}>
                                                                <MobileCompactCard product={product} />
                                                            </CardBadgeWrap>
                                                        </motion.div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                </main>
            </div>
        </ConfigProvider>
    );
}

// ── Wrapper para Badge (Agotado / Destacado) ──
const CardBadgeWrap = ({ product, children }) => {
    if (product.stock === 'Agotado' || product.stock === 0) {
        return <Badge.Ribbon text="Agotado" color="volcano">{children}</Badge.Ribbon>;
    }
    if (product.isFeatured) {
        return <Badge.Ribbon text="Destacado" color="#A68966">{children}</Badge.Ribbon>;
    }
    return children;
};

// ══════════════════════════════════════════════════
//  1. TARJETA PC (Desktop) — 4 columnas, compacta
// ══════════════════════════════════════════════════
const DesktopCard = ({ product }) => {
    const navigate = useNavigate();
    const isOutOfStock = product.stock === 'Agotado' || product.stock === 0;
    const imgUrl = product.coverImage || product.imageUrl;

    return (
        <Card
            hoverable
            onClick={() => navigate(`/producto/${product.id}`)}
            className="overflow-hidden border-valex-gris/10 group bg-[#1e1e1f] h-full flex flex-col transition-all duration-500 hover:border-valex-bronce/30 shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] cursor-pointer"
            cover={
                <div className="relative aspect-square overflow-hidden bg-transparent">
                    {imgUrl ? (
                        <div 
                            className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                            style={{ backgroundImage: `url(${imgUrl})`, filter: isOutOfStock ? 'grayscale(100%) opacity(70%)' : 'none' }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-valex-negro">
                            <span className="text-valex-gris/30 font-serif italic text-sm">Sin imagen</span>
                        </div>
                    )}
                </div>
            }
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px' }}
        >
            <div className="text-[10px] font-sans tracking-[0.2em] text-valex-gris uppercase mb-0.5">{product.category}</div>
            <Typography.Title level={5} className="!font-serif !text-valex-hueso !mt-0 !mb-0.5 group-hover:!text-valex-bronce transition-colors !text-sm lg:!text-base">
                {product.name}
            </Typography.Title>
            <div className="text-[11px] text-valex-gris/60 font-sans tracking-wide mb-2">{product.family || '—'}</div>
            <div className="mt-auto flex items-center justify-between pt-2 border-t border-valex-gris/10">
                <span className="font-sans font-medium text-valex-bronce text-base tracking-wide">${Number(product.price).toFixed(2)}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/producto/${product.id}`); }}
                    className="text-[10px] font-sans uppercase tracking-[0.2em] text-valex-bronce hover:text-valex-hueso transition-all duration-300 border-b border-valex-bronce/30 hover:border-valex-hueso pb-0.5"
                >VER</button>
            </div>
        </Card>
    );
};

// ══════════════════════════════════════════════════
//  2. TARJETA MÓVIL LISTA — 1 producto por pantalla
//     Viewport ref: 360x800 ~ 430x932 (CSS px)
//     Navbar + toolbar ≈ 160px → card = 100dvh - 160px
// ══════════════════════════════════════════════════
const MobileCard = ({ product }) => {
    const navigate = useNavigate();
    const isOutOfStock = product.stock === 'Agotado' || product.stock === 0;
    const imgUrl = product.coverImage || product.imageUrl;

    return (
        <div 
            className="overflow-hidden rounded-lg border border-valex-gris/10 bg-[#1e1e1f] flex flex-col cursor-pointer group"
            style={{ height: 'calc(100dvh - 160px)' }}
            onClick={() => navigate(`/producto/${product.id}`)}
        >
            {/* Imagen — ocupa todo el espacio disponible */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
                {imgUrl ? (
                    <div 
                        className="w-full h-full bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url(${imgUrl})`, filter: isOutOfStock ? 'grayscale(100%) opacity(70%)' : 'none' }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-valex-negro">
                        <span className="text-valex-gris/30 font-serif italic text-sm">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Info — altura fija, no crece */}
            <div className="flex-shrink-0 px-4 py-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-sans tracking-[0.2em] text-valex-gris uppercase">{product.category}</div>
                    <div className="text-[10px] font-sans tracking-wide text-valex-gris/50">{product.family || ''}</div>
                </div>
                <h3 className="font-serif text-valex-hueso text-lg leading-tight group-hover:text-valex-bronce transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs font-light text-valex-gris/50 line-clamp-2 leading-relaxed">
                    {product.description || product.notes || '—'}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-valex-gris/10 mt-1">
                    <span className="font-sans font-semibold text-valex-bronce text-xl tracking-wide">${Number(product.price).toFixed(2)}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/producto/${product.id}`); }}
                        className="text-xs font-serif uppercase tracking-[0.15em] text-valex-negro bg-valex-bronce px-4 py-1.5 rounded hover:bg-valex-hueso transition-all duration-300"
                    >VER DETALLES</button>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════
//  3. TARJETA MÓVIL CUADRÍCULA — 2 columnas, mini
// ══════════════════════════════════════════════════
const MobileCompactCard = ({ product }) => {
    const navigate = useNavigate();
    const isOutOfStock = product.stock === 'Agotado' || product.stock === 0;
    const imgUrl = product.coverImage || product.imageUrl;

    return (
        <Card
            hoverable
            onClick={() => navigate(`/producto/${product.id}`)}
            className="overflow-hidden border-valex-gris/10 group bg-[#1e1e1f] h-full flex flex-col shadow-none cursor-pointer"
            cover={
                <div className="relative aspect-square overflow-hidden bg-transparent">
                    {imgUrl ? (
                        <div 
                            className="w-full h-full bg-center bg-no-repeat bg-cover"
                            style={{ backgroundImage: `url(${imgUrl})`, filter: isOutOfStock ? 'grayscale(100%) opacity(70%)' : 'none' }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-valex-negro">
                            <span className="text-valex-gris/30 font-serif italic text-xs">Sin imagen</span>
                        </div>
                    )}
                </div>
            }
            bodyStyle={{ padding: '8px 10px' }}
        >
            <Typography.Title level={5} className="!font-serif !text-valex-hueso !mt-0 !mb-0.5 !text-xs">
                {product.name}
            </Typography.Title>
            <span className="font-sans font-medium text-valex-bronce text-sm">${Number(product.price).toFixed(2)}</span>
        </Card>
    );
};
