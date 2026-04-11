import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const SEED_ORDERS = [
    {
        cliente: 'María Fernanda López',
        telefono: '8888-1234',
        correo: 'mfernanda@gmail.com',
        direccion: 'San José, Escazú, residencial Los Pinos, casa 14',
        items: [
            { name: 'Oud Mystique', quantity: 1, price: 45000, currency: 'CRC' },
            { name: 'Rose Elixir', quantity: 2, price: 38000, currency: 'CRC' },
        ],
        total: '₡121.000',
        status: 'nuevo',
    },
    {
        cliente: 'Carlos Rodríguez Mora',
        telefono: '7777-5678',
        correo: 'crodriguez@hotmail.com',
        direccion: 'Heredia, San Pablo, frente al supermercado Buen Precio',
        items: [
            { name: 'Black Opium Intense', quantity: 1, price: 89.99, currency: 'USD' },
        ],
        total: '$89.99',
        status: 'en proceso',
    },
    {
        cliente: 'Ana Gabriela Soto',
        telefono: '6666-9012',
        correo: '',
        direccion: 'Cartago, La Unión, calle principal 200m norte del parque',
        items: [
            { name: 'Velvet Orchid', quantity: 1, price: 52000, currency: 'CRC' },
            { name: 'Ambre Nuit', quantity: 1, price: 67000, currency: 'CRC' },
        ],
        total: '₡119.000',
        status: 'entregado',
    },
    {
        cliente: 'Diego Jiménez Vargas',
        telefono: '5555-3456',
        correo: 'djimenez@empresa.com',
        direccion: 'Alajuela, centro, edificio Torre Azul, piso 3 oficina 8',
        items: [
            { name: 'Bleu de Chanel', quantity: 1, price: 120.00, currency: 'USD' },
            { name: 'Sauvage Dior', quantity: 1, price: 105.00, currency: 'USD' },
        ],
        total: '$225.00',
        status: 'en proceso',
    },
    {
        cliente: 'Sofía Méndez Quirós',
        telefono: '4444-7890',
        correo: 'sofia.mendez@gmail.com',
        direccion: 'Liberia, Guanacaste, barrio San Roque, casa esquinera verde',
        items: [
            { name: 'Coco Mademoiselle', quantity: 2, price: 95.00, currency: 'USD' },
        ],
        total: '$190.00',
        status: 'nuevo',
    },
    {
        cliente: 'Roberto Alvarado Cruz',
        telefono: '3333-2345',
        correo: '',
        direccion: 'Pérez Zeledón, San Isidro, 100m sur de la municipalidad',
        items: [
            { name: 'Tom Ford Oud Wood', quantity: 1, price: 78000, currency: 'CRC' },
        ],
        total: '₡78.000',
        status: 'cancelado',
    },
    {
        cliente: 'Valeria Castro Núñez',
        telefono: '9999-6789',
        correo: 'vcastro@yahoo.com',
        direccion: 'San José, Desamparados, urbanización El Progreso, casa C-12',
        items: [
            { name: 'La Vie Est Belle', quantity: 1, price: 75.00, currency: 'USD' },
            { name: 'Mon Guerlain', quantity: 1, price: 68.00, currency: 'USD' },
        ],
        total: '$143.00',
        status: 'entregado',
    },
];

export const seedOrders = async () => {
    const col = collection(db, 'orders');
    const promises = SEED_ORDERS.map((order, i) => {
        const daysAgo = (SEED_ORDERS.length - i) * 3;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const orderNumber = i + 1;
        return addDoc(col, {
            ...order,
            orderNumber,
            orderId: `ORD-${String(orderNumber).padStart(4, '0')}`,
            createdAt: date,
        });
    });
    await Promise.all(promises);
};
