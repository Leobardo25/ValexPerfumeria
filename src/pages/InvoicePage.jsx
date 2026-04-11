import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getProducts } from '../services/productService';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Download, Package } from 'lucide-react';
import { IoLogoWhatsapp, IoLogoInstagram } from 'react-icons/io';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formatPrice = (price, currency) => {
    const n = Number(price);
    if (currency === 'CRC') return `₡${Math.round(n).toLocaleString('es-CR')}`;
    return `$${n.toFixed(2)}`;
};

const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const BRAND_NEGRO  = '#1A1A1B';
const BRAND_BRONCE = '#A68966';
const BRAND_HUESO  = '#F5F5F5';
const BRAND_GRIS   = '#D1D1D1';

function SectionLabel({ children }) {
    return (
        <p style={{ color: BRAND_BRONCE }}
            className="text-[10px] font-bold uppercase tracking-widest mb-3">
            {children}
        </p>
    );
}

function InfoRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex flex-col py-2.5 border-b last:border-0" style={{ borderColor: '#2a2a2b' }}>
            <span className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: BRAND_GRIS }}>{label}</span>
            <span className="text-sm font-medium" style={{ color: BRAND_HUESO }}>{value}</span>
        </div>
    );
}

function InvoiceDocument({ order, productImages, config, invoiceRef }) {
    const currency = order.items?.[0]?.currency || 'CRC';
    const subtotal = (order.items || []).reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity), 0
    );

    return (
        <div
            ref={invoiceRef}
            className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: BRAND_NEGRO, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
            {/* ── Header ── */}
            <div className="px-7 py-7" style={{ borderBottom: `1px solid ${BRAND_BRONCE}33` }}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-widest uppercase"
                            style={{ color: BRAND_BRONCE, fontFamily: 'Georgia, serif' }}>
                            {config.brandName || 'Mi Tienda'}
                        </h1>
                        {config.brandTagline && (
                            <p className="text-xs mt-0.5 tracking-wide" style={{ color: BRAND_GRIS }}>
                                {config.brandTagline}
                            </p>
                        )}
                        {config.whatsapp && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: BRAND_GRIS }}>
                                <IoLogoWhatsapp className="w-3 h-3" style={{ color: BRAND_BRONCE }} />
                                +{config.whatsapp}
                            </div>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: BRAND_BRONCE }}>Factura</p>
                        <p className="font-bold text-lg mt-0.5" style={{ color: BRAND_HUESO }}>
                            {order.orderId || `#${order.id?.slice(-6).toUpperCase()}`}
                        </p>
                        <p className="text-xs mt-1" style={{ color: BRAND_GRIS }}>{formatDate(order.createdAt)}</p>
                    </div>
                </div>
            </div>

            {/* ── Datos del cliente ── */}
            <div className="px-7 py-6" style={{ borderBottom: `1px solid ${BRAND_BRONCE}22` }}>
                <SectionLabel>Datos del cliente</SectionLabel>
                <div>
                    <InfoRow label="Nombre"   value={order.cliente} />
                    <InfoRow label="Teléfono" value={order.telefono} />
                    <InfoRow label="Correo"   value={order.correo} />
                    <InfoRow label="Dirección de entrega" value={order.direccion} />
                </div>
            </div>

            {/* ── Productos ── */}
            <div className="px-7 py-6" style={{ borderBottom: `1px solid ${BRAND_BRONCE}22` }}>
                <SectionLabel>Productos</SectionLabel>
                <div className="space-y-3">
                    {(order.items || []).map((item, i) => {
                        const img = productImages?.[item.name];
                        return (
                            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                                style={{ backgroundColor: '#222223' }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                                    style={{ backgroundColor: '#2a2a2b', border: `1px solid ${BRAND_BRONCE}33` }}>
                                    {img
                                        ? <img src={img} alt={item.name} className="w-full h-full object-contain" />
                                        : <Package className="w-4 h-4" style={{ color: BRAND_BRONCE }} />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: BRAND_HUESO }}>{item.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: BRAND_GRIS }}>
                                        ×{item.quantity} · {formatPrice(item.price, item.currency)} c/u
                                    </p>
                                </div>
                                <span className="text-sm font-semibold flex-shrink-0" style={{ color: BRAND_BRONCE }}>
                                    {formatPrice(Number(item.price) * Number(item.quantity), item.currency)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Total ── */}
            <div className="px-7 py-5" style={{ borderBottom: `1px solid ${BRAND_BRONCE}22` }}>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: BRAND_GRIS }}>Subtotal</span>
                        <span className="text-sm" style={{ color: BRAND_HUESO }}>{formatPrice(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: BRAND_GRIS }}>Envío</span>
                        <span className="text-xs" style={{ color: BRAND_GRIS }}>Por coordinar</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-1"
                        style={{ borderTop: `1px solid ${BRAND_BRONCE}44` }}>
                        <span className="text-base font-bold" style={{ color: BRAND_HUESO }}>Total</span>
                        <span className="text-lg font-bold" style={{ color: BRAND_BRONCE }}>
                            {order.total || formatPrice(subtotal, currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-7 py-5 flex items-center justify-between gap-4"
                style={{ backgroundColor: '#111112' }}>
                <p className="text-xs" style={{ color: BRAND_GRIS }}>
                    Gracias por tu compra en{' '}
                    <span style={{ color: BRAND_BRONCE }} className="font-semibold">{config.brandName}</span> 💜
                </p>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {config.whatsapp && (
                        <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: BRAND_GRIS }} className="hover:opacity-75 transition-opacity">
                            <IoLogoWhatsapp className="w-4 h-4" />
                        </a>
                    )}
                    {config.instagram && config.instagram !== 'https://instagram.com' && (
                        <a href={config.instagram} target="_blank" rel="noopener noreferrer"
                            style={{ color: BRAND_GRIS }} className="hover:opacity-75 transition-opacity">
                            <IoLogoInstagram className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function InvoicePage() {
    const { orderId } = useParams();
    const config = useSiteConfig();
    const [order, setOrder] = useState(null);
    const [productImages, setProductImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [snap, products] = await Promise.all([
                    getDoc(doc(db, 'orders', orderId)),
                    getProducts(),
                ]);
                if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
                const imgMap = {};
                products.forEach(p => { if (p.name) imgMap[p.name] = p.coverImage || p.imageUrl || null; });
                setProductImages(imgMap);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [orderId]);

    const handleDownload = async () => {
        if (!invoiceRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            const filename = `factura-${order?.cliente?.split(' ')[0] || 'pedido'}-${orderId.slice(-6)}.pdf`;
            pdf.save(filename);
        } catch (e) {
            console.error('Error generando PDF:', e);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500 font-medium">Factura no encontrada.</p>
                <p className="text-gray-400 text-sm mt-1">El enlace puede ser incorrecto o el pedido fue eliminado.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#111112' }}>
            <div className="max-w-lg mx-auto mb-5 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: BRAND_GRIS }}>
                    Comprobante de compra
                </p>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-opacity disabled:opacity-50 no-print"
                    style={{ backgroundColor: BRAND_BRONCE, color: BRAND_NEGRO }}
                >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Generando...' : 'Descargar PDF'}
                </button>
            </div>

            <InvoiceDocument
                order={order}
                productImages={productImages}
                config={config}
                invoiceRef={invoiceRef}
            />

            <p className="text-center text-xs mt-6 no-print" style={{ color: '#555' }}>
                Puedes guardar esta página como PDF desde tu navegador.
            </p>
        </div>
    );
}
