import { collection, doc, getDocs, updateDoc, serverTimestamp, query, orderBy, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION = 'orders';
const COUNTER_DOC = doc(db, 'counters', 'orders');

export const createOrder = async (orderData) => {
    try {
        let orderNumber;
        let newDocRef;

        await runTransaction(db, async (tx) => {
            const counterSnap = await tx.get(COUNTER_DOC);
            orderNumber = (counterSnap.exists() ? counterSnap.data().count : 0) + 1;
            tx.set(COUNTER_DOC, { count: orderNumber });

            newDocRef = doc(collection(db, COLLECTION));
            tx.set(newDocRef, {
                ...orderData,
                orderNumber,
                orderId: `ORD-${String(orderNumber).padStart(4, '0')}`,
                status: 'nuevo',
                createdAt: serverTimestamp(),
            });
        });

        return { id: newDocRef.id, orderNumber, orderId: `ORD-${String(orderNumber).padStart(4, '0')}` };
    } catch (error) {
        console.error('Error creando pedido:', error);
        throw error;
    }
};

export const getOrders = async () => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error('Error actualizando estado de pedido:', error);
        throw error;
    }
};
