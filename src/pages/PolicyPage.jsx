import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSiteConfig } from '../services/siteConfigService';
import { Layout, ConfigProvider, theme as antTheme } from 'antd';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const { Content } = Layout;

export const DEFAULT_POLICIES = {
    refunds: {
        title: 'Política de Reembolsos',
        content: `En VALEX Perfumería, tu satisfacción es nuestra prioridad. A continuación, describimos las condiciones bajo las cuales ofrecemos reembolsos o cambios.

**Productos Elegibles para Reembolso**
- Solo se aceptan devoluciones de productos sellados, sin abrir y en su empaque original.
- El plazo máximo para solicitar un reembolso es de 7 días naturales a partir de la fecha de entrega.
- Los productos personalizados, muestras o decants no son elegibles para devolución.

**Proceso de Solicitud**
1. Contáctanos por WhatsApp o correo electrónico indicando tu número de pedido.
2. Nuestro equipo evaluará tu solicitud en un plazo máximo de 48 horas hábiles.
3. Si la devolución es aprobada, te indicaremos cómo enviar el producto de vuelta.

**Reembolso**
- Una vez recibido y verificado el producto, el reembolso se procesará dentro de los 5 días hábiles siguientes.
- El reembolso se realizará por el mismo método de pago utilizado en la compra original.
- Los costos de envío de la devolución corren por cuenta del cliente, salvo que el producto haya llegado defectuoso o incorrecto.

**Productos Defectuosos**
Si recibes un producto dañado, defectuoso o diferente al que ordenaste, contáctanos de inmediato. Cubriremos el envío de devolución y te ofreceremos un reemplazo o reembolso completo.`
    },
    shipping: {
        title: 'Política de Envíos',
        content: `En VALEX Perfumería optimizamos nuestro proceso logístico para que recibas tu fragancia favorita de la manera más segura y rápida posible.

**Cobertura**
- Realizamos envíos a todo Costa Rica.
- Las entregas se realizan mediante Correos de Costa Rica o mensajería privada según la zona.

**Tiempos de Entrega**
- Gran Área Metropolitana (GAM): 1-3 días hábiles.
- Fuera del GAM: 3-5 días hábiles.
- Pedidos internacionales (importación): 10-15 días hábiles.

**Costos de Envío**
- El costo de envío se calcula al momento de la compra según la ubicación de entrega.
- Promociones de envío gratuito aplican según condiciones vigentes.

**Empaque**
- Todos nuestros productos se envían en empaque de lujo con protección especial para fragancias.
- Cada paquete incluye un sello de autenticidad y material de protección contra golpes.

**Seguimiento**
- Una vez despachado tu pedido, recibirás un número de seguimiento por WhatsApp para que puedas rastrear tu paquete en tiempo real.`
    },
    privacy: {
        title: 'Política de Privacidad',
        content: `En VALEX Perfumería, respetamos y protegemos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.

**Información que Recopilamos**
- Datos de contacto: nombre, número de teléfono, dirección de entrega.
- Información de pedido: productos adquiridos, historial de compras.
- Datos de navegación: cookies y datos analíticos anónimos para mejorar tu experiencia.

**Uso de la Información**
- Procesar y entregar tus pedidos correctamente.
- Comunicarte el estado de tu pedido por WhatsApp o correo.
- Mejorar nuestros productos y servicios.
- Enviarte promociones exclusivas (solo si das tu consentimiento).

**Protección de Datos**
- Tu información personal nunca se vende ni se comparte con terceros para fines comerciales.
- Utilizamos medidas de seguridad estándar de la industria para proteger tu información.
- Los datos de pago son procesados por plataformas seguras certificadas.

**Tus Derechos**
- Puedes solicitar acceso, corrección o eliminación de tus datos personales en cualquier momento contactándonos directamente.
- Puedes optar por dejar de recibir comunicaciones promocionales cuando lo desees.`
    },
    terms: {
        title: 'Términos de Servicio',
        content: `Al acceder y utilizar el sitio web de VALEX Perfumería, aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente.

**Uso del Sitio**
- Este sitio web es operado por VALEX Perfumería. Al utilizarlo, confirmas que tienes al menos 18 años de edad o cuentas con el consentimiento de un tutor legal.
- Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso.

**Productos y Precios**
- Todos los productos ofrecidos son 100% originales y auténticos. Garantizamos la autenticidad de cada fragancia.
- Los precios están sujetos a cambios sin previo aviso y se muestran en la moneda indicada (CRC o USD).
- Las imágenes de los productos son referenciales y pueden variar ligeramente del producto real.

**Pedidos**
- Al realizar un pedido, estás haciendo una oferta de compra sujeta a disponibilidad de inventario.
- Nos reservamos el derecho de cancelar pedidos en caso de errores de precio, inventario agotado o sospecha de fraude.
- Una vez confirmado el pago, el pedido se considera en proceso y no puede ser cancelado.

**Propiedad Intelectual**
- Todo el contenido de este sitio (textos, imágenes, diseños, logotipos) es propiedad de VALEX Perfumería y está protegido por las leyes de propiedad intelectual.
- Queda prohibida la reproducción total o parcial del contenido sin autorización previa.

**Limitación de Responsabilidad**
- VALEX Perfumería no se hace responsable de daños indirectos derivados del uso de este sitio web.
- No garantizamos la disponibilidad ininterrumpida del sitio.`
    }
};

const POLICY_KEYS = ['refunds', 'shipping', 'privacy', 'terms'];

export default function PolicyPage() {
    const { policyType } = useParams();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!POLICY_KEYS.includes(policyType)) {
            navigate('/');
            return;
        }

        getSiteConfig('policies').then((data) => {
            if (data?.[policyType]?.title && data[policyType]?.content) {
                setPolicy(data[policyType]);
            } else {
                setPolicy(DEFAULT_POLICIES[policyType]);
            }
            setLoading(false);
        }).catch(() => {
            setPolicy(DEFAULT_POLICIES[policyType]);
            setLoading(false);
        });
    }, [policyType, navigate]);

    // Simple markdown-ish renderer for bold text
    const renderContent = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return <h3 key={i} className="font-sans font-semibold text-valex-hueso text-base mt-8 mb-3">{line.replace(/\*\*/g, '')}</h3>;
            }
            if (line.startsWith('- ')) {
                return <li key={i} className="text-valex-gris/70 text-sm font-light leading-relaxed ml-4 list-disc">{line.slice(2)}</li>;
            }
            if (/^\d+\.\s/.test(line)) {
                return <li key={i} className="text-valex-gris/70 text-sm font-light leading-relaxed ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
            }
            if (line.trim() === '') {
                return <div key={i} className="h-2" />;
            }
            return <p key={i} className="text-valex-gris/70 text-sm font-light leading-relaxed">{line}</p>;
        });
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: antTheme.darkAlgorithm,
                token: {
                    colorPrimary: '#A68966',
                    colorBgBase: '#1A1A1B',
                    fontFamily: '"Poppins", sans-serif',
                }
            }}
        >
            <div className="min-h-screen bg-valex-negro flex flex-col">
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                <Content className="flex-1 pt-[80px] lg:pt-[110px] px-4 sm:px-6 lg:px-8 max-w-3xl w-full mx-auto pb-24">
                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-valex-gris mb-8 hover:text-valex-bronce text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                    </button>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-valex-bronce/30 border-t-valex-bronce rounded-full animate-spin" />
                        </div>
                    ) : policy ? (
                        <div className="animate-in fade-in">
                            <span className="inline-block text-valex-bronce font-sans text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
                                Políticas de Tienda
                            </span>
                            <h1 className="font-sans font-semibold text-3xl lg:text-4xl text-valex-hueso mb-8 leading-tight">
                                {policy.title}
                            </h1>
                            <div className="border-t border-valex-bronce/20 pt-8">
                                {renderContent(policy.content)}
                            </div>

                            {/* Última actualización */}
                            <div className="mt-16 pt-6 border-t border-valex-gris/10">
                                <p className="text-valex-gris/30 text-xs">
                                    Última actualización: Abril 2026 — VALEX Perfumería
                                </p>
                            </div>
                        </div>
                    ) : null}
                </Content>

                <Footer />
            </div>
        </ConfigProvider>
    );
}
