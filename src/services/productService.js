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
 * Crea un producto nuevo, subiendo la imagen si existe
 */
export const createProduct = async (productData, imageFile) => {
    try {
        let imageUrl = '';
        if (imageFile) {
            // Sube a la carpeta 'products/'
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const newDocRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...productData,
            imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        return { id: newDocRef.id, ...productData, imageUrl };
    } catch (error) {
        console.error("Error creando producto:", error);
        throw error;
    }
};

/**
 * Actualiza un producto existente, y si hay imagen nueva, la sube.
 */
export const updateProduct = async (id, updatedData, newImageFile = null, oldImageUrl = null) => {
    try {
        let imageUrl = oldImageUrl; // Mantener la vieja por defecto
        
        if (newImageFile) {
            // Subir nueva
            const storageRef = ref(storage, `products/${Date.now()}_${newImageFile.name}`);
            const snapshot = await uploadBytes(storageRef, newImageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
            
            // Nota: Aquí se podría intentar borrar la imagen anterior (opcional para ahorrar espacio)
            // deleteObject(ref(storage, oldImageUrl)).catch(err => console.log('Error borrando imagen vieja', err));
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updatedData,
            imageUrl,
            updatedAt: serverTimestamp()
        });

        return { id, ...updatedData, imageUrl };
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
