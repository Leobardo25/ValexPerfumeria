import { createContext, useContext, useState, useEffect } from 'react';
import { notification } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    // 1. Initial State from LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('valex_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error("Failed to parse cart items", error);
            }
        }
    }, []);

    // 2. Persist to LocalStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('valex_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });

        // Trigger highly aesthetic Antd Notification
        notification.success({
            message: <span className="font-serif tracking-wide text-valex-bronce">Anexado a la Bolsa</span>,
            description: <span className="text-valex-gris">{product.name} fue añadido a tu pedido.</span>,
            placement: 'bottomRight',
            icon: <ShoppingCartOutlined style={{ color: '#A68966' }} />,
            style: { backgroundColor: '#1e1e1f', border: '1px solid rgba(166,137,102,0.3)', color: '#F5F5F5' },
            closeIcon: <span className="text-valex-gris hover:text-white">×</span>
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        notification.info({
            message: 'Eliminado',
            description: 'Producto retirado de la bolsa.',
            placement: 'bottomRight',
            icon: <DeleteOutlined style={{ color: '#d9363e' }} />,
            style: { backgroundColor: '#1e1e1f', border: '1px solid #333', color: '#F5F5F5' }
        });
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    };

    const value = {
        cartItems,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
