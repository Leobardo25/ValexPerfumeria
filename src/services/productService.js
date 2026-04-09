import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
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

        // 1. Generamos la referencia del documento ANTES de guardarlo
        // para obtener el ID y usarlo como nombre de la carpeta en Storage
        const newDocRef = doc(collection(db, COLLECTION_NAME));
        const productId = newDocRef.id;

        // 2. Subir Portada Principal a su carpeta respectiva
        if (coverFile) {
            const coverRef = ref(storage, `products/${productId}/cover_${Date.now()}_${coverFile.name}`);
            const snapshot = await uploadBytes(coverRef, coverFile);
            coverImage = await getDownloadURL(snapshot.ref);
        }

        // 3. Subir Imágenes de Galería Concurrente a su carpeta
        if (galleryFiles && galleryFiles.length > 0) {
            const uploadPromises = galleryFiles.map(async (file, index) => {
                const galRef = ref(storage, `products/${productId}/gal_${index}_${Date.now()}_${file.name}`);
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

        // 4. Guardamos el producto con su ID reservado
        await setDoc(newDocRef, finalProductData);
        
        return { id: productId, ...finalProductData };
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

        // 1. Si hay nueva Portada, la subimos a la carpeta del producto
        if (newCoverFile) {
            const coverRef = ref(storage, `products/${id}/cover_${Date.now()}_${newCoverFile.name}`);
            const snapshot = await uploadBytes(coverRef, newCoverFile);
            coverImage = await getDownloadURL(snapshot.ref);
        }

        // 2. Si se subieron nuevas imágenes para la galería, las añadimos
        if (newGalleryFiles && newGalleryFiles.length > 0) {
            const uploadPromises = newGalleryFiles.map(async (file, index) => {
                const galRef = ref(storage, `products/${id}/gal_${index}_${Date.now()}_${file.name}`);
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
        // 1. Borramos todas las imágenes en la carpeta de Storage del producto
        const folderRef = ref(storage, `products/${id}`);
        try {
            const folderContents = await listAll(folderRef);
            const deletePromises = folderContents.items.map((itemRef) => deleteObject(itemRef));
            await Promise.all(deletePromises);
        } catch (storageError) {
            // Ignorar errores si la carpeta no existe (por ejemplo productos viejos en la raiz)
            console.log(`Carpeta de imágenes para el producto ${id} no encontrada o vacía.`, storageError);
        }

        // 2. Borramos el documento de Firestore
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return true;
    } catch (error) {
        console.error(`Error eliminando producto ${id}:`, error);
        throw error;
    }
};
