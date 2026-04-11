import { useState } from 'react';
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { Button, Typography, notification } from 'antd';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NEW_PRODUCTS = [
    {
        name: "Versace Eros Najim",
        category: "Masculino",
        family: "Oriental",
        price: 48500,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Caramelo, Mandarina, Madera de Oud, Incienso, Especias.",
        description: "Versace Eros Najim (2024) es una fragancia masculina de la familia Oriental Amaderada, descrita como una estrella radiante y potente que evoca la calidez del desierto al atardecer. Combina caramelo y mandarina italiana con madera de oud, incienso y especias, ofreciendo un aroma intenso, dulce y sofisticado.",
        localImageUrl: "/images/productos/versace_eros_najim/versace_eros_najim.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Carolina Herrera La Bomba",
        category: "Femenino",
        family: "Floral",
        price: 75000,
        currency: "CRC",
        ml: "80",
        stock: "Disponible",
        notes: "Pitahaya (Fruta del dragón), Peonía Roja, Vainilla Solar.",
        description: "La Bomba de Carolina Herrera es una fragancia femenina floral-ambarada, intensa y vibrante, diseñada para mujeres seguras y libres. Destaca por su aroma exótico de pitahaya (fruta del dragón), peonía roja y vainilla solar en un frasco fucsia con forma de mariposa, simbolizando energía y transformación.",
        localImageUrl: "/images/productos/carolina_herrera_la_bomba/carolina_herrera_la_bomba.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Jean Paul Gaultier Scandal Pour Homme",
        category: "Masculino",
        family: "Amaderado",
        price: 55500,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Caramelo, Haba Tonka, Mandarina, Esclarea.",
        description: "Scandal Pour Homme de Jean Paul Gaultier (2021) es un Eau de Toilette intenso, amaderado y oriental, diseñado para ser seductor y provocativo. Destaca por una adictiva combinación de caramelo y haba tonka, equilibrada con mandarina y esclarea, que ofrece gran duración (8+ horas) y una fuerte estela, ideal para la noche, fiestas o clima frío.",
        localImageUrl: "/images/productos/jpg_scandal_pour_homme/jpg_scandal_pour_homme.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Tommy Girl",
        category: "Femenino",
        family: "Floral",
        price: 22000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Grosellas Negras, Camelia, Mandarina, Menta, Rosa, Limón.",
        description: "Tommy Girl de Tommy Hilfiger (1996) es una fragancia icónica floral-frutal, fresca y enérgica, diseñada para la mujer moderna, inteligente y espontánea. Creada por Calice Becker, destaca por notas de grosellas negras, camelia, mandarina y manzano en flor, con un corazón de menta, rosa y limón, ideal para uso diario en primavera/verano.",
        localImageUrl: "/images/productos/tommy_girl/tommy_girl.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Bvlgari Man Terrae Essence",
        category: "Masculino",
        family: "Amaderado",
        price: 52500,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Tierra mojada, Cítricos, Vetiver.",
        description: "Bvlgari Man Terrae Essence es una fragancia amaderada terrosa, creada por el perfumista Alberto Morillas como un homenaje a la fertilidad de la tierra. Destaca por su aroma a tierra mojada, cítricos y vetiver, ofreciendo un perfil sofisticado y cálido ideal para otoño o primavera.",
        localImageUrl: "/images/productos/bvlgari_man_terrae_essence/bvlgari_man_terrae_essence.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Carolina Herrera Good Girl Elixir",
        category: "Femenino",
        family: "Floral",
        price: 65000,
        currency: "CRC",
        ml: "50",
        stock: "Disponible",
        notes: "Rosa Cautivadora, Vainilla Voluminosa, Pachulí Ahumado.",
        description: "Good Girl Blush Elixir de Carolina Herrera es un Eau de Parfum intenso y sofisticado, caracterizado como un aroma chipre floral y amaderado. Es una versión más sensual y atrevida de Good Girl Blush, destacando por una mezcla incandescente de rosa cautivadora, vainilla voluminosa y pachulí ahumado.",
        localImageUrl: "/images/productos/ch_good_girl_elixir/ch_good_girl_elixir.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Carolina Herrera Bad Boy Extreme",
        category: "Masculino",
        family: "Amaderado",
        price: 60000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Jengibre, Cacao Profundo, Vetiver, Pachulí.",
        description: "Carolina Herrera Bad Boy Extreme es una fragancia amaderada aromática de 2023, intensa y seductora, que redefine la masculinidad moderna con una mezcla de jengibre, cacao profundo y vetiver. Es una versión \"extreme\" de alta durabilidad (hasta 10 horas) y proyección generosa, ideal para noches frescas o eventos sociales, destacando por su balance entre cacao cremoso, especias y notas amaderadas de pachulí.",
        localImageUrl: "/images/productos/ch_bad_boy_extreme/ch_bad_boy_extreme.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Paco Rabanne 1 Million Elixir",
        category: "Masculino",
        family: "Amaderado",
        price: 58000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Manzana, Davana, Rosa de Damasco, Vainilla, Haba Tonka.",
        description: "1 Million Elixir de Paco Rabanne (2022) es una fragancia masculina de la familia amaderada aromática, caracterizada por ser extremadamente dulce, intensa y de larga duración. Destaca por notas de manzana, davana, rosa de Damasco, vainilla y haba tonka, ideal para clima frío, la noche y uso juvenil.",
        localImageUrl: "/images/productos/pr_one_million_elixir/pr_one_million_elixir.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Bharara King",
        category: "Masculino",
        family: "Cítrico",
        price: 37000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Naranja, Bergamota, Limón, Vainilla, Almizcle Blanco, Ámbar.",
        description: "Bharara King es una fragancia árabe Eau de Parfum aromática y frutal para hombres, conocida por ser dulce, cítrica y de alta duración. Destaca por notas de naranja, bergamota, limón, notas afrutadas, vainilla, almizcle blanco y ámbar, ideal para uso diario o eventos nocturnos por su gran fijación.",
        localImageUrl: "/images/productos/bharara_king/bharara_king.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Invictus Victory",
        category: "Masculino",
        family: "Oriental",
        price: 58000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Limón, Pimienta Rosa, Lavanda, Incienso, Vainilla, Haba Tonka.",
        description: "Invictus Victory de Paco Rabanne es un Eau de Parfum de la familia olfativa Ámbar para hombres, lanzado en 2021. Destaca por un intenso contraste entre frescor y sensualidad, combinando notas de limón y pimienta rosa con un corazón de lavanda e incienso, y un fondo dulce y adictivo de vainilla y haba tonka.",
        localImageUrl: "/images/productos/invictus_victory/invictus_victory.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Jean Paul Gaultier Le Beau",
        category: "Masculino",
        family: "Amaderado",
        price: 60000,
        currency: "CRC",
        ml: "75",
        stock: "Disponible",
        notes: "Coco, Piña, Haba Tonka, Jengibre, Sándalo.",
        description: "Jean Paul Gaultier Le Beau Le Parfum (2022) es una fragancia ambarina amaderada intensa, creada por Quentin Bisch. Destaca por sus notas tropicales y adictivas de coco, piña y haba tonka, con un toque fresco de jengibre y una base sensual de sándalo. Es un aroma juvenil, dulce y seductor, ideal para la noche.",
        localImageUrl: "/images/productos/jpg_le_beau/jpg_le_beau.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Givenchy Gentleman Society",
        category: "Masculino",
        family: "Amaderado",
        price: 54000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Tabaco, Ámbar, Vainilla de Madagascar, Cuero.",
        description: "Givenchy Gentleman Society Ambrée es un Eau de Parfum oriental amaderado para hombres, descrito como una versión intensa, cálida y sofisticada de la línea Society. Combina notas de tabaco, ámbar, vainilla de Madagascar y un toque de cuero, ofreciendo un aroma adictivo y elegante, ideal para citas y uso en clima frío.",
        localImageUrl: "/images/productos/gentleman_society/gentleman_society.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Bvlgari Pour Homme",
        category: "Masculino",
        family: "Amaderado",
        price: 52500,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Té Darjeeling, Bergamota, Almizcle.",
        description: "Bvlgari Pour Homme (1996) es una fragancia clásica, amaderada floral almizclada, conocida por su aroma limpio, sutil y sofisticado. Creada por Jacques Cavallier, destaca por su nota distintiva de té Darjeeling, bergamota y almizcle, ofreciendo una estela moderada-suave ideal para la oficina, el uso diario y climas cálidos.",
        localImageUrl: "/images/productos/bvlgari_pour_homme/bvlgari_pour_homme.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Azzaro Wanted",
        category: "Masculino",
        family: "Amaderado",
        price: 45000,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Limón, Jengibre, Lavanda, Cardamomo.",
        description: "Azzaro Wanted (2016) es una fragancia amaderada especiada para hombres, creada por Fabrice Pellegrin y Olivier Cresp, que destaca por su frescura cítrica inicial y un fondo cálido y seductor. Diseñada para el hombre intrépido y seguro de sí mismo, combina notas de limón, jengibre, lavanda y cardamomo en un icónico frasco tipo barril.",
        localImageUrl: "/images/productos/azzaro_wanted/azzaro_wanted.webp",
        localGalleryUrls: [],
        isFeatured: true
    },
    {
        name: "Carolina Herrera CH Men",
        category: "Masculino",
        family: "Oriental",
        price: 52500,
        currency: "CRC",
        ml: "100",
        stock: "Disponible",
        notes: "Hierba, Bergamota, Azafrán, Nuez Moscada, Cuero, Vainilla, Azúcar.",
        description: "CH Men de Carolina Herrera es una fragancia oriental especiada, definida por su elegancia, sensualidad y estilo aventurero. Combina notas de salida de hierba y bergamota con un corazón amaderado de azafrán y nuez moscada, cerrando con cuero, vainilla y azúcar, ideal para hombres que buscan un aroma sofisticado y magnético.",
        localImageUrl: "/images/productos/ch_men/ch_men.webp",
        localGalleryUrls: [],
        isFeatured: true
    }
];

export default function SeedProducts() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        try {
            const productsRef = collection(db, 'products');
            let addedCount = 0;
            // 1. ELIMINAR TODOS LOS PRODUCTOS EXISTENTES PRIMERO
            const existingQuery = await getDocs(productsRef);
            for (const d of existingQuery.docs) {
                // Limpiar storage (carpeta del id)
                try {
                    const fRef = ref(storage, `products/${d.id}`);
                    const folderContents = await listAll(fRef);
                    await Promise.all(folderContents.items.map(i => deleteObject(i)));
                } catch(e) { } // ignorar si no existe
                // Borrar db
                await deleteDoc(doc(db, 'products', d.id));
            }

            // 2. CREAR NUEVOS CON ESTRUCTURA DE CARPETAS
            for (const prod of NEW_PRODUCTS) {
                // Generar el ID primero
                const newDocRef = doc(collection(db, 'products'));
                const productId = newDocRef.id;

                let coverImageUrl = prod.localImageUrl;
                let galleryUrls = [];

                try {
                    // Subir Cover Image
                    const response = await fetch(prod.localImageUrl);
                    const blob = await response.blob();
                    
                    const coverName = `products/${productId}/cover_${Date.now()}_${prod.localImageUrl.split('/').pop()}`;
                    const storageRef = ref(storage, coverName);
                    await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
                    coverImageUrl = await getDownloadURL(storageRef);
                    
                    // Subir Gallery Images concurrentemente (y autodetectar _bg.webp si existe localmente)
                    const bgUrl = prod.localImageUrl.replace('.webp', '_bg.webp');
                    const bgResponse = await fetch(bgUrl);
                    
                    if (bgResponse.ok) {
                        const bgBlob = await bgResponse.blob();
                        if (bgBlob.type.includes('image')) {
                            const galName = `products/${productId}/gal_bg_${Date.now()}_${bgUrl.split('/').pop()}`;
                            const galRef = ref(storage, galName);
                            await uploadBytes(galRef, bgBlob, { contentType: 'image/webp' });
                            const bgDownloadUrl = await getDownloadURL(galRef);
                            galleryUrls.push(bgDownloadUrl);
                        }
                    }

                    // A continuación, si en algún momento se incluyen más imágenes en localGalleryUrls
                    const galleryPromises = prod.localGalleryUrls.map(async (localUrl, index) => {
                        const res = await fetch(localUrl);
                        if (!res.ok) return null;
                        const galBlob = await res.blob();
                        const galName = `products/${productId}/gal_${index}_${Date.now()}_${localUrl.split('/').pop()}`;
                        const galRef = ref(storage, galName);
                        await uploadBytes(galRef, galBlob, { contentType: 'image/webp' });
                        return getDownloadURL(galRef);
                    });
                    
                    const additionalGals = await Promise.all(galleryPromises);
                    galleryUrls = [...galleryUrls, ...additionalGals.filter(url => url !== null)];
                } catch (err) {
                    console.warn(`⚠️ No se pudo subir ${prod.localImageUrl} a Firebase Storage.`, err);
                }

                const finalProduct = {
                     ...prod,
                     coverImage: coverImageUrl,
                     galleryImages: galleryUrls
                };
                delete finalProduct.localImageUrl;
                delete finalProduct.localGalleryUrls;

                await setDoc(newDocRef, finalProduct);
                addedCount++;
            }

            notification.success({
                message: 'Inyección Exitosa',
                description: `Se añadieron ${addedCount} productos maestros de alta gama a la base de datos.`,
                placement: 'top'
            });
        } catch (error) {
            console.error('Error inyectando productos:', error);
            notification.error({
                message: 'Error',
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-valex-negro flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full bg-[#1e1e1f] border border-valex-bronce/30 p-10 rounded-2xl text-center shadow-[0_0_50px_rgba(166,137,102,0.1)]">
                <Title level={2} className="!font-serif !text-valex-hueso !mb-2">Centro de Inyección</Title>
                <Text className="text-valex-gris block mb-8 font-light">
                    Presiona el botón para <b>eliminar el catálogo actual</b> y cargar instantáneamente los 5 productos premium de prueba. Se subirán organizados en carpetas dentro de tu Storage.
                </Text>
                
                <Button 
                    type="primary" 
                    size="large"
                    onClick={handleSeed}
                    loading={loading}
                    icon={loading ? <SyncOutlined spin /> : <CheckCircleOutlined />}
                    className="w-full !h-14 !text-lg !font-serif !tracking-widest uppercase !bg-valex-bronce hover:!bg-valex-bronce-light border-none text-black"
                >
                    {loading ? 'Subiendo datos...' : 'INYECTAR 5 PRODUCTOS VIP'}
                </Button>
                
                <Text className="text-valex-gris/50 block mt-6 text-xs italic">
                    Una vez inyectados, ve a /tienda para verlos. Puedes inyectar múltiples veces (creará duplicados).
                </Text>
            </div>
        </div>
    );
}
