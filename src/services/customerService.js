import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getOrders } from './orderService';

const COLLECTION = 'customers';

export const getCustomers = async () => {
    try {
        const customerMap = {};

        // 1. Cargar todos los clientes guardados en la BD (manuales y pre-existentes)
        const metaSnap = await getDocs(collection(db, COLLECTION));
        metaSnap.docs.forEach(docSnap => {
            const data = docSnap.data();
            customerMap[docSnap.id] = {
                id: docSnap.id,
                name: data.name || 'Desconocido',
                phone: data.phone || docSnap.id,
                email: data.email || '',
                totalOrders: 0,
                orders: [],
                ltvRaw: 0,
                lastPurchaseDate: null,
                notes: data.notes || '',
                createdAt: data.createdAt?.toDate?.() || null,
                hidden: data.hidden || false,
            };
        });

        // 2. Obtener todos los pedidos para cruzar historiales automáticos
        const orders = await getOrders();
        
        orders.forEach(order => {
            // SOLO consideramos pedidos "entregado" para poblar el CRM dinámico
            if (order.status !== 'entregado') return;

            let key = order.telefono ? String(order.telefono).replace(/\D/g, '') : null;
            if (!key) key = order.correo ? order.correo.toLowerCase() : null;
            if (!key) return; // Si no hay ni tel ni correo verificable, ignoramos en CRM relacional
            
            if (!customerMap[key]) {
                customerMap[key] = {
                    id: key,
                    name: order.cliente || 'Desconocido',
                    phone: order.telefono || '',
                    email: order.correo || '',
                    totalOrders: 0,
                    orders: [],
                    ltvRaw: 0,
                    lastPurchaseDate: null,
                    notes: '',
                    createdAt: new Date(),
                    hidden: false,
                };
            }
            
            const cust = customerMap[key];
            cust.totalOrders += 1;
            cust.orders.push({
                id: order.id,
                orderId: order.orderId,
                date: order.createdAt?.toDate?.() || new Date(),
                total: order.total
            });
            
            if (order.total) {
                const numericString = String(order.total).replace(/[^\d.,]/g, '');
                const normalized = numericString.replace(/,/g, '');
                const val = parseFloat(normalized);
                if (!isNaN(val)) {
                    cust.ltvRaw += val;
                }
            }
        });

        // Procesar fechas y nombres
        Object.values(customerMap).forEach(cust => {
            cust.orders.sort((a, b) => b.date - a.date);
            if (cust.orders.length > 0) {
                cust.lastPurchaseDate = cust.orders[0].date;
            }
            // Actualizar nombre al del último pedido solo si actualmente era "Desconocido" o no venía de DB
            if (cust.name === 'Desconocido' && cust.orders.length > 0) {
                const lastO = orders.find(x => x.id === cust.orders[0].id);
                if (lastO && lastO.cliente) cust.name = lastO.cliente;
            }
        });

        // Ordenar y omitir los ocultos
        return Object.values(customerMap)
            .filter(c => !c.hidden)
            .sort((a, b) => {
            const dateA = a.lastPurchaseDate || a.createdAt || new Date(0);
            const dateB = b.lastPurchaseDate || b.createdAt || new Date(0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error('Error procesando clientes:', error);
        return [];
    }
};

export const updateCustomerMetadata = async (customerId, data) => {
    try {
        const docRef = doc(db, COLLECTION, customerId);
        await setDoc(docRef, {
            ...data,
            updatedAt: new Date(),
            // Si es nuevo, asegurar createdAt
            ...(!data.updatedAt && { createdAt: new Date() })
        }, { merge: true });
    } catch (error) {
        console.error('Error actualizando metadata de cliente:', error);
        throw error;
    }
};

export const hideCustomer = async (customerId) => {
    try {
        const docRef = doc(db, COLLECTION, customerId);
        await setDoc(docRef, { hidden: true }, { merge: true });
    } catch (error) {
        console.error('Error ocultando cliente:', error);
        throw error;
    }
};
