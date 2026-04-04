import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

const COLLECTION_NAME = 'products';

/**
 * Trae todos los productos desde Firestore
 */
export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        throw error;
    }
};

/**
 * Trae un solo producto por su ID
 */
export const getProductById = async (id) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error(`Error obteniendo el producto ${id}:`, error);
        throw error;
    }
};

/**
 * Crea un producto nuevo, subiendo la imagen principal y las imágenes de galería si existen
 */
export const createProduct = async (productData, coverFile, galleryFiles = []) => {
    try {
        let coverImage = '';
        let galleryImages = [];

        // 1. Subir Portada Principal
        if (coverFile) {
            const coverRef = ref(storage, `products/${Date.now()}_cover_${coverFile.name}`);
            const snapshot = await uploadBytes(coverRef, coverFile);
            coverImage = await getDownloadURL(snapshot.ref);
        }

        // 2. Subir Imágenes de Galería Concurrente
        if (galleryFiles && galleryFiles.length > 0) {
            const uploadPromises = galleryFiles.map(async (file, index) => {
                const galRef = ref(storage, `products/${Date.now()}_gal${index}_${file.name}`);
                const snap = await uploadBytes(galRef, file);
                return getDownloadURL(snap.ref);
            });
            galleryImages = await Promise.all(uploadPromises);
        }

        const finalProductData = {
            ...productData,
            coverImage,
            galleryImages,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const newDocRef = await addDoc(collection(db, COLLECTION_NAME), finalProductData);
        
        return { id: newDocRef.id, ...finalProductData };
    } catch (error) {
        console.error("Error creando producto:", error);
        throw error;
    }
};

/**
 * Actualiza un producto existente, y si hay imagen nueva, la sube.
 */
export const updateProduct = async (id, productData, newCoverFile, currentCoverUrl, newGalleryFiles = [], currentGalleryUrls = []) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        let coverImage = currentCoverUrl || '';
        let galleryImages = [...(currentGalleryUrls || [])]; // Mantenemos las previas inicialmente

        // 1. Si hay nueva Portada, la subimos y reemplaza la vieja
        if (newCoverFile) {
            const coverRef = ref(storage, `products/${Date.now()}_cover_${newCoverFile.name}`);
            const snapshot = await uploadBytes(coverRef, newCoverFile);
            coverImage = await getDownloadURL(snapshot.ref);
        }

        // 2. Si se subieron nuevas imágenes para la galería, las añadimos
        if (newGalleryFiles && newGalleryFiles.length > 0) {
            const uploadPromises = newGalleryFiles.map(async (file, index) => {
                const galRef = ref(storage, `products/${Date.now()}_gal${index}_${file.name}`);
                const snap = await uploadBytes(galRef, file);
                return getDownloadURL(snap.ref);
            });
            const newUrls = await Promise.all(uploadPromises);
            // Concatenamos las nuevas a las existentes (o podríamos reemplazarlas dependiendo de la UI)
            galleryImages = [...galleryImages, ...newUrls];
        }

        const updatePayload = {
            ...productData,
            coverImage,
            galleryImages,
            updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, updatePayload);
        return { id, ...updatePayload };
    } catch (error) {
        console.error(`Error actualizando producto ${id}:`, error);
        throw error;
    }
};

/**
 * Elimina un producto de Firestore.
 */
export const deleteProduct = async (id) => {
    try {
        // En una app más avanzada, aquí también referenciarías y eliminarías la imagen alojada en Storage
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return true;
    } catch (error) {
        console.error(`Error eliminando producto ${id}:`, error);
        throw error;
    }
};
