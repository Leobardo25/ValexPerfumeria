import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Leer manualmente el .env.local sin librerías externas
const envPath = path.resolve(__dirname, '../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
    const match = envFile.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : undefined;
};

// 2. Configurar Firebase con las variables
const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID')
};

console.log("Iniciando conexión a Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 3. Los datos de prueba 'Lujo Silencioso'
const seedProducts = [
    {
        name: "Oud Mystique",
        category: "Masculino",
        notes: "Madera de oud oscuro · Ámbar cálido · Incienso",
        description: "Una fragancia intensa y profundamente varonil, diseñada para aquellos que aprecian el lujo de dejar una estela misteriosa. Notas de madera milenaria se fusionan con resinas preciosas.",
        price: 120.00,
        stock: "Disponible",
        isFeatured: true,
        imageFile: "oud-test.png"
    },
    {
        name: "Citrus Aura Extrait",
        category: "Unisex",
        notes: "Bergamota de Calabria · Almizcle blanco · Vetiver",
        description: "Brillante, versátil y deslumbrantemente fresca, pero con un fondo sofisticado que perdura. Como los primeros rayos de sol filtrándose a través de un balcón de mármol de Florencia.",
        price: 95.00,
        stock: "Disponible",
        isFeatured: true,
        imageFile: "citrus-test.png"
    },
    {
        name: "Velvet Rose",
        category: "Femenino",
        notes: "Rosa damascena · Orquídea negra · Vainilla ahumada",
        description: "Un floral oscuro y moderno. Se aleja de la frescura primaveral tradicional para abrazar una rosa seductora, profunda y cautivadora, perfecta para ocasiones nocturnas.",
        price: 110.00,
        stock: "Disponible",
        isFeatured: true,
        imageFile: "velvet-test.png"
    }
];

// Ruta física donde movimos las imágenes locales
const imagesDir = path.resolve(__dirname, '../src/img/perfumeria');

async function uploadProduct(productData) {
    const { imageFile, ...data } = productData;
    let imageUrl = '';

    try {
        console.log(`Subiendo foto de ${data.name}...`);
        
        // Cargar imagen en memoria como Uint8Array para el cliente de Firebase Web usado en Node
        const absoluteImagePath = path.join(imagesDir, imageFile);
        const imageBuffer = fs.readFileSync(absoluteImagePath);
        const uint8Array = new Uint8Array(imageBuffer);

        // Referencia a Storage
        const fileRef = ref(storage, `products/${Date.now()}_${imageFile}`);
        
        // uploadBytes acepta Uint8Array
        const snapshot = await uploadBytes(fileRef, uint8Array, { contentType: 'image/png' });
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log(`✓ Foto subida! URL: ${imageUrl}`);

        // Crear documento en Firestore
        console.log(`Creando entrada en la Base de Datos para ${data.name}...`);
        const docRef = await addDoc(collection(db, 'products'), {
            ...data,
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log(`✅ ${data.name} añadido con éxito (ID: ${docRef.id})\n`);
    } catch (error) {
        console.error(`❌ Error al crear producto ${data.name}:`, error);
        throw error;
    }
}

async function runSeeder() {
    console.log("=== INICIANDO SUBIDA AUTOMÁTICA DE DATOS ===");
    console.log("============================================\n");
    
    // NOTA IMPORTANTE: Para que este script funcione desde la terminal sin iniciar sesión de usuario,
    // las reglas en Firebase (Storage y Firestore) deben ser: allow write: if true; temporalmente.

    for (const prod of seedProducts) {
        await uploadProduct(prod);
    }
    
    console.log("🎉 ¡Proceso terminado! Ya puedes revisar tu Panel de Administración.");
    process.exit(0);
}

runSeeder();
