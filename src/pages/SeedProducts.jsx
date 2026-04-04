import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { Button, Typography, notification } from 'antd';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NEW_PRODUCTS = [
  {
    name: "Vanilla Noir Extraordinare",
    category: "Unisex",
    family: "Oriental",
    price: 185.00,
    stock: 25,
    notes: "Vainilla de Madagascar, Ámbar puro, Tabaco tostado, Incienso.",
    description: "Una sinfonía oscura y envolvente. Vanilla Noir desafía los sentidos con una vainilla ahumada de Madagascar profundamente madurada, cortada por la calidez del ámbar puro y el tabaco tostado. Un perfume para la noche y el misterio.",
    localImageUrl: "/images/vanilla_noir.png",
    isFeatured: true
  },
  {
    name: "Rose Gold Essence",
    category: "Femenino",
    family: "Floral",
    price: 140.00,
    stock: 12,
    notes: "Rosas Búlgaras, Peonía, Almizcle Blanco, Sándalo.",
    description: "Elegancia embotellada. Un homenaje a la sofisticación moderna, Rose Gold Essence resplandece con un Bouquet de Rosas Búlgaras frescas y Peonías cubiertas de rocío, sentando una base de Almizcle Blanco que acaricia la piel por más de 12 horas.",
    localImageUrl: "/images/rose_gold_essence.png",
    isFeatured: false
  },
  {
    name: "Oceanic Vetiver",
    category: "Masculino",
    family: "Acuático",
    price: 130.00,
    stock: 40,
    notes: "Vetiver de Haití, Sal Marina, Bergamota, Maderas Costeras.",
    description: "El poder del acantilado en tu piel. Oceanic Vetiver combina la frescura implacable de la sal marina y la bergamota con las notas terrosas, robustas y varoniles del vetiver haitiano más puro. Para el hombre moderno y seguro.",
    localImageUrl: "/images/oceanic_vetiver.png",
    isFeatured: false
  },
  {
    name: "Spiced Saffron Intense",
    category: "Unisex",
    family: "Oriental",
    price: 210.00,
    stock: 8,
    notes: "Azafrán Rojo, Praliné, Maderas de Cedro, Especias Árabes.",
    description: "Oriental, exótico y sumamente adictivo. Una extravagancia de Azafrán rojo infundido con un corazón de praliné gourmand. Destinado a aquellos que no temen dejar una estela magnética e inolvidable al caminar.",
    localImageUrl: "/images/spiced_saffron.png",
    isFeatured: true
  },
  {
    name: "Midnight Leather",
    category: "Masculino",
    family: "Cuero",
    price: 165.00,
    stock: 15,
    notes: "Cuero Toscano, Frambuesa Oscura, Cardamomo, Pachulí.",
    description: "Peligrosamente adictivo. Midnight Leather abraza la brutalidad cruda del cuero toscano artesanal suavizado con la acidez de la frambuesa oscura, logrando una fragancia alfa, imponente e increíblemente nocturna.",
    localImageUrl: "/images/midnight_leather.png",
    isFeatured: false
  }
];

export default function SeedProducts() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        try {
            const productsRef = collection(db, 'products');
            let addedCount = 0;
            
            for (const prod of NEW_PRODUCTS) {
                let coverImageUrl = prod.localImageUrl;
                let galleryUrls = [prod.localImageUrl, prod.localImageUrl, prod.localImageUrl];

                try {
                    // Leer imagen local a Blob
                    const response = await fetch(prod.localImageUrl);
                    const blob = await response.blob();
                    
                    // Intentar subir a Firebase Storage
                    const fileName = `products/${Date.now()}_${prod.localImageUrl.split('/').pop()}`;
                    const storageRef = ref(storage, fileName);
                    await uploadBytes(storageRef, blob, { contentType: 'image/png' });
                    coverImageUrl = await getDownloadURL(storageRef);
                    galleryUrls = [coverImageUrl, coverImageUrl, coverImageUrl];
                } catch (err) {
                    console.warn(`⚠️ No se pudo subir ${prod.localImageUrl} a Firebase Storage (posible falta de permisos o CORS). Usando ruta local temporalmente.`, err);
                }

                // Reemplazar URL con la nueva estructura de Cover y Gallery
                const finalProduct = {
                     ...prod,
                     coverImage: coverImageUrl,
                     galleryImages: galleryUrls
                };
                delete finalProduct.localImageUrl;

                await addDoc(productsRef, finalProduct);
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
                    Presiona el botón para cargar instantáneamente los 5 nuevos productos premium (Vanilla Noir, Rose Gold, Oceanic Vetiver, Spiced Saffron, Midnight Leather) en tu tienda.
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
