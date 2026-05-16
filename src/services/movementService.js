/**
 * movementService.js — Servicio de Entradas y Salidas de Inventario
 * 
 * MODULAR: Este archivo es autocontenido. Para usarlo en otro proyecto,
 * solo necesitas copiar este archivo y asegurarte de que tu firebase.js
 * exporte `db` (Firestore instance).
 * 
 * Colección: inventory_movements
 */

import { 
    collection, doc, getDocs, addDoc, serverTimestamp, 
    query, orderBy, where, limit, runTransaction, Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION = 'inventory_movements';
const PRODUCTS_COLLECTION = 'products';

// ── Tipos de movimiento ──
export const MOVEMENT_TYPES = {
    entrada: {
        label: 'Entrada',
        color: 'emerald',
        reasons: [
            { value: 'compra', label: 'Compra a proveedor' },
            { value: 'devolucion', label: 'Devolución de cliente' },
            { value: 'ajuste_positivo', label: 'Ajuste positivo' },
        ],
    },
    salida: {
        label: 'Salida',
        color: 'red',
        reasons: [
            { value: 'venta', label: 'Venta' },
            { value: 'dano', label: 'Daño / Pérdida' },
            { value: 'muestra', label: 'Muestra / Regalo' },
            { value: 'ajuste_negativo', label: 'Ajuste negativo' },
        ],
    },
};

/**
 * Crea un movimiento y ajusta el stock del producto atómicamente.
 * 
 * @param {Object} data
 * @param {string} data.productId - ID del producto
 * @param {string} data.productName - Nombre del producto (desnormalizado para consultas rápidas)
 * @param {'entrada'|'salida'} data.type - Tipo de movimiento
 * @param {string} data.reason - Razón específica (compra, venta, dano, etc.)
 * @param {number} data.quantity - Cantidad movida (siempre positivo)
 * @param {number} [data.amount] - Monto en dinero asociado al movimiento
 * @param {string} [data.currency] - Moneda del monto (CRC, USD)
 * @param {string} [data.notes] - Notas opcionales
 * @param {string} [data.createdBy] - Nombre del admin que registra
 * @param {string} [data.orderId] - ID del pedido (si viene de una venta automática)
 */
export const createMovement = async (data) => {
    const { productId, productName, type, reason, quantity, amount, currency, notes, createdBy, orderId } = data;

    if (!productId || !type || !reason || !quantity || quantity <= 0) {
        throw new Error('Datos incompletos para registrar movimiento.');
    }

    const delta = type === 'entrada' ? quantity : -quantity;

    await runTransaction(db, async (tx) => {
        // 1. Leer stock actual del producto
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await tx.get(productRef);

        if (!productSnap.exists()) {
            throw new Error('Producto no encontrado.');
        }

        const currentQty = productSnap.data().quantity ?? 0;
        const newQty = Math.max(0, currentQty + delta);

        // 2. Crear el movimiento
        const movementRef = doc(collection(db, COLLECTION));
        tx.set(movementRef, {
            productId,
            productName: productName || '',
            type,
            reason,
            quantity: Number(quantity),
            amount: Number(amount) || 0,
            currency: currency || '',
            previousStock: currentQty,
            newStock: newQty,
            notes: notes || '',
            createdBy: createdBy || 'Admin',
            orderId: orderId || '',
            createdAt: serverTimestamp(),
        });

        // 3. Actualizar stock del producto
        tx.update(productRef, { 
            quantity: newQty,
            updatedAt: serverTimestamp(),
        });
    });
};

/**
 * Registra salidas automáticas para todos los items de un pedido entregado.
 * 
 * @param {Object} order - Objeto del pedido con items[]
 * @param {Array} products - Lista de productos para resolver IDs
 * @param {string} adminName - Nombre del admin
 */
export const createSaleMovements = async (order, products, adminName) => {
    if (!order?.items?.length) return;

    const promises = order.items.map(async (item) => {
        // Buscar producto por nombre
        const product = products.find(p => p.name === item.name);
        if (!product) return;

        const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

        await createMovement({
            productId: product.id,
            productName: item.name,
            type: 'salida',
            reason: 'venta',
            quantity: Number(item.quantity) || 1,
            amount: itemTotal,
            currency: item.currency || product.currency || '',
            notes: `Pedido ${order.orderId || order.id} — ${order.cliente || 'Cliente'}`,
            createdBy: adminName || 'Sistema',
            orderId: order.orderId || order.id,
        });
    });

    await Promise.all(promises);
};

/**
 * Obtiene movimientos con filtros opcionales.
 * 
 * @param {Object} [filters]
 * @param {'entrada'|'salida'} [filters.type] - Filtrar por tipo
 * @param {string} [filters.productId] - Filtrar por producto
 * @param {number} [filters.maxResults] - Límite de resultados (default 200)
 */
export const getMovements = async (filters = {}) => {
    try {
        let constraints = [orderBy('createdAt', 'desc')];

        if (filters.type) {
            constraints.push(where('type', '==', filters.type));
        }
        if (filters.productId) {
            constraints.push(where('productId', '==', filters.productId));
        }

        constraints.push(limit(filters.maxResults || 200));

        const q = query(collection(db, COLLECTION), ...constraints);
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error('Error obteniendo movimientos:', error);
        throw error;
    }
};

/**
 * Obtiene el historial de movimientos de un producto específico.
 */
export const getMovementsByProduct = async (productId) => {
    return getMovements({ productId });
};

/**
 * Obtiene los movimientos más recientes (para el dashboard).
 */
export const getRecentMovements = async (count = 5) => {
    return getMovements({ maxResults: count });
};
