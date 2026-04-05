import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Layout, Row, Col, Button, Typography, Skeleton, notification, Breadcrumb, Collapse, Rate, Divider, ConfigProvider, theme as antTheme } from 'antd';
import { ShoppingCartOutlined, LeftOutlined, RightOutlined, SafetyCertificateOutlined, CodeSandboxOutlined, StarFilled } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product ? (product.galleryImages?.length > 0 ? product.galleryImages : [product.coverImage || product.imageUrl].filter(Boolean)) : [];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    notification.error({ message: 'Producto no encontrado.' });
                    navigate('/tienda');
                }
            } catch (error) {
                console.error("Error obteniendo producto:", error);
                notification.error({ message: 'Error de carga.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    const isOutOfStock = product?.stock === 'Agotado' || product?.stock === 0 || product?.stock === 'Bóveda (Retirado)';

    return (
        <ConfigProvider
            theme={{
                algorithm: antTheme.darkAlgorithm,
                token: {
                    colorPrimary: '#A68966',       // Bronce
                    colorBgBase: '#1A1A1B',        // Negro Mate
                    colorBgContainer: '#1e1e1f',
                    colorTextBase: '#F5F5F5',      // Blanco Hueso
                    colorTextSecondary: '#D1D1D1', // Gris Piedra
                    fontFamily: '"Poppins", sans-serif',
                }
            }}
        >
            <div className="min-h-screen bg-valex-negro flex flex-col">
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                <Content className="flex-1 pt-[80px] lg:pt-[110px] px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto pb-24">
                    {/* BREADCRUMB */}
                    <Breadcrumb 
                        separator=">" 
                        className="mb-8 hidden md:block"
                        items={[
                            { title: <span className="cursor-pointer text-valex-gris hover:text-valex-bronce transition-colors" onClick={() => navigate('/tienda')}>Tienda</span> },
                            { title: <span className="text-valex-hueso">{loading ? 'Cargando...' : product?.name}</span> }
                        ]}
                    />

                    {/* Botón Móvil Atrás */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="md:hidden flex items-center text-valex-gris mb-3 hover:text-valex-hueso text-sm"
                    >
                        <LeftOutlined className="mr-2" /> Volver
                    </button>

                    {loading ? (
                        <div className="w-full max-w-3xl mx-auto mb-10 text-center animate-pulse hidden md:block">
                            <div className="h-3 bg-valex-gris/10 w-24 mx-auto mb-4 rounded" />
                            <div className="h-12 bg-valex-gris/10 w-3/4 mx-auto md:w-2/3 rounded" />
                        </div>
                    ) : (
                        <div className="text-center mb-4 md:mb-10 w-full max-w-3xl mx-auto transition-opacity duration-700">
                            <Title level={1} className="!font-serif !text-3xl sm:!text-4xl lg:!text-5xl !text-valex-hueso !mb-0 !font-normal !tracking-tight mx-auto max-w-2xl px-2">
                                {product.name}
                            </Title>
                        </div>
                    )}

                    {loading ? (
                        <Row gutter={[48, 48]}>
                            <Col xs={24} md={11} lg={12}>
                                {/* Skeleton idéntico para evitar "layout shift" o "flash", sin pulse agresivo */}
                                <div className="aspect-square bg-transparent border border-valex-gris/10 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-valex-bronce/30 border-t-valex-bronce animate-spin" />
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <Skeleton active paragraph={{ rows: 6 }} />
                                <Skeleton.Button active block size="large" className="mt-8 !h-16" />
                            </Col>
                        </Row>
                    ) : (
                        <Row gutter={[{ xs: 0, md: 48 }, { xs: 24, md: 48 }]} className="items-start transition-opacity duration-700">
                            {/* COLUMNA IZQUIERDA: GALERÍA CARUSEL */}
                            <Col xs={24} md={11} lg={12}>
                                <div className="sticky top-24">
                                    <div className="aspect-square bg-transparent relative border border-valex-gris/10 overflow-hidden group rounded-sm">
                                        <img 
                                            src={images[currentImageIndex]} 
                                            alt={product.name} 
                                            className="hidden" 
                                            onLoad={() => setMainImageLoaded(true)} 
                                        />

                                        {/* Spinner Interno idéntico y fluido */}
                                        {!mainImageLoaded && (
                                            <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10 transition-opacity duration-500">
                                                <div className="w-8 h-8 rounded-full border-2 border-valex-bronce/30 border-t-valex-bronce animate-spin" />
                                            </div>
                                        )}

                                        <div 
                                            className={`w-full h-full bg-center bg-no-repeat bg-cover transition-all duration-1000 ease-out ${mainImageLoaded ? 'opacity-100' : 'opacity-0 scale-95'}`}
                                            style={{ 
                                                backgroundImage: `url(${images[currentImageIndex]})`,
                                                filter: isOutOfStock ? 'grayscale(100%) opacity(70%)' : 'none'
                                            }}
                                        />

                                        {/* Navegación del Carrusel Overlay */}
                                        {images.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); prevImage(); setMainImageLoaded(false); }}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/70 hover:bg-valex-bronce hover:text-black transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                                                >
                                                    <LeftOutlined />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); nextImage(); setMainImageLoaded(false); }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/70 hover:bg-valex-bronce hover:text-black transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                                                >
                                                    <RightOutlined />
                                                </button>
                                                
                                                {/* Indicadores Minimalistas Puntos */}
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                                    {images.map((_, idx) => (
                                                        <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-valex-bronce shadow-[0_0_8px_rgba(166,137,102,0.8)]' : 'w-2 bg-white/40 hover:bg-white/70 cursor-pointer'}`} onClick={() => { setCurrentImageIndex(idx); setMainImageLoaded(false); }} />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {isOutOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <span className="bg-red-900/80 text-white font-serif tracking-widest px-8 py-3 text-xl backdrop-blur-sm border border-red-500/30">
                                                    AGOTADO TEMPORALMENTE
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            {/* COLUMNA DERECHA: INFO DE COMPRA */}
                            <Col xs={24} md={13} lg={12}>
                                <div className="flex flex-col h-full pl-0 md:pl-4 pt-4 md:pt-0">
                                    <Text className="uppercase tracking-[0.3em] text-valex-gris text-[10px] md:text-xs font-semibold mb-2 block">
                                        {product.category}
                                    </Text>
                                    
                                    {/* Social Proof Mock */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex text-valex-bronce text-xs md:text-sm">
                                            <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                                        </div>
                                        <Text className="text-valex-gris text-xs md:text-sm underline cursor-pointer">4.9/5 (128 Reseñas)</Text>
                                    </div>

                                    <Text className="!text-2xl md:!text-3xl font-sans font-medium text-valex-bronce mb-6 inline-block">
                                        ${Number(product.price).toFixed(2)}
                                    </Text>

                                    <div className="flex flex-row gap-3 sm:gap-4 mb-8 w-full">
                                        <Button 
                                            size="large"
                                            disabled={isOutOfStock}
                                            onClick={handleAddToCart}
                                            icon={<ShoppingCartOutlined className="text-lg sm:text-xl" />}
                                            className="flex-1 !h-14 !bg-transparent hover:!bg-valex-bronce/10 !border-valex-bronce/40 hover:!border-valex-bronce !text-valex-hueso hover:!text-valex-bronce transition-all flex items-center justify-center font-serif px-1"
                                        >
                                            <span className="tracking-widest text-[10px] sm:text-sm md:text-sm ml-1 sm:ml-2 mt-[2px]">AÑADIR A BOLSA</span>
                                        </Button>
                                        
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            disabled={isOutOfStock}
                                            onClick={() => {
                                                handleAddToCart();
                                                navigate('/checkout'); // Flujo rápido
                                            }}
                                            className="flex-1 !h-14 !text-xs sm:!text-sm md:!text-base !font-serif !tracking-widest uppercase !bg-valex-bronce hover:!bg-valex-bronce-light border-none shadow-[0_0_15px_rgba(166,137,102,0.2)] hover:shadow-[0_0_20px_rgba(166,137,102,0.4)] px-1"
                                        >
                                            {isOutOfStock ? 'Agotado' : 'COMPRAR AHORA'}
                                        </Button>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="flex justify-between border-y border-valex-gris/10 py-6 mb-8 gap-4 px-2">
                                        <div className="flex flex-col items-center text-center gap-2 w-1/3">
                                            <SafetyCertificateOutlined className="text-2xl text-valex-bronce" />
                                            <span className="text-xs text-valex-gris font-light">Garantía de Autenticidad</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-2 w-1/3 border-x border-valex-gris/10">
                                            <CodeSandboxOutlined className="text-2xl text-valex-bronce" />
                                            <span className="text-xs text-valex-gris font-light">Envío Seguro y Discreto</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-2 w-1/3">
                                            <StarFilled className="text-2xl text-valex-bronce" />
                                            <span className="text-xs text-valex-gris font-light">Alta Concentración (Parfum)</span>
                                        </div>
                                    </div>

                                    {/* Acordeones Sensoriales */}
                                    <Collapse defaultActiveKey={['1']} ghost expandIconPosition="end">
                                        <Collapse.Panel header={<span className="font-serif tracking-widest text-valex-hueso text-base">LA EXPERIENCIA</span>} key="1">
                                            <Paragraph className="!text-valex-gris !text-sm !font-light leading-relaxed">
                                                {product.description || "Una fragancia magistral que redefine la perfumería clásica. Construida con los ingredientes más puros y exóticos recolectados alrededor del mundo. Cada gota es una historia de lujo, pasión y exclusividad absoluta."}
                                            </Paragraph>
                                        </Collapse.Panel>

                                        <Collapse.Panel header={<span className="font-serif tracking-widest text-valex-hueso text-base">NOTAS OLFATIVAS</span>} key="2">
                                            <Paragraph className="!text-valex-gris !text-sm !font-light leading-relaxed whitespace-pre-wrap">
                                                {product.notes || "Notas de Salida: Esperando datos.\nNotas de Corazón: Esperando datos.\nNotas de Fondo: Esperando datos."}
                                            </Paragraph>
                                        </Collapse.Panel>

                                        <Collapse.Panel header={<span className="font-serif tracking-widest text-valex-hueso text-base">ENVÍO Y DEVOLUCIONES</span>} key="3">
                                            <Paragraph className="!text-valex-gris !text-sm !font-light leading-relaxed">
                                                Todos nuestros perfumes se envían en empaques de lujo con sellos de autenticidad. Los tiempos de tránsito suelen ser de 2-4 días hábiles dependiendo de la región. Devoluciones permitidas en productos sin desellar.
                                            </Paragraph>
                                        </Collapse.Panel>
                                    </Collapse>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* MÓDULO DE TESTIMONIOS (MOCK HIGH CONVERSION) */}
                    {!loading && (
                        <div className="mt-32 border-t border-valex-gris/10 pt-20">
                            <Title level={2} className="!font-serif !text-3xl !text-valex-hueso text-center !mb-12 !font-normal">
                                Lo que dicen nuestros clientes
                            </Title>
                            <Row gutter={[24, 24]}>
                                {[
                                    { name: "Roberto M.", title: "Impresionante duración", review: "Jamás había recibido tantos cumplidos en la oficina. La estela que deja es de puro lujo. Dura más de 12 horas en mi piel." },
                                    { name: "Elena F.", title: "Elegancia embotellada", review: "Compré este perfume a ciegas y superó mis expectativas. El aroma evoluciona maravillosamente con el paso de las horas." },
                                    { name: "Carlos D.", title: "Autenticidad pura", review: "He usado fragancias nicho durante años, pero la calidad de los ingredientes aquí se nota inmediatamente. Mi nueva firma personal." }
                                ].map((testo, idx) => (
                                    <Col xs={24} md={8} key={idx}>
                                        <div className="bg-[#1a1a1b] border border-valex-gris/10 p-8 rounded-lg h-full flex flex-col">
                                            <div className="flex text-valex-bronce text-xs mb-4">
                                                <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                                            </div>
                                            <Text className="!text-valex-hueso font-bold mb-3 block">{testo.title}</Text>
                                            <Paragraph className="!text-valex-gris !text-sm !font-light flex-1">"{testo.review}"</Paragraph>
                                            <Text className="text-valex-gris text-xs border-t border-valex-gris/10 pt-4 mt-4 block">
                                                {testo.name} <span className="text-valex-bronce ml-2">✓ Compra Verificada</span>
                                            </Text>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Content>

                <Footer />
            </div>
        </ConfigProvider>
    );
}
