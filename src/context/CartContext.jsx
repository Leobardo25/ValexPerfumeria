import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ShoppingBag } from 'lucide-react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('valex_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const isCartOpenRef = useRef(false);
    const isHydrated = useRef(false);

    // Efecto para manejar el botón atrás de Android con el CartDrawer
    useEffect(() => {
        const handlePopState = () => {
            if (isCartOpenRef.current) {
                isCartOpenRef.current = false;
                setIsCartDrawerOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Sin dependencias: usa ref para evitar closure stale

    const handleSetIsCartDrawerOpen = useCallback((open) => {
        if (open) {
            isCartOpenRef.current = true;
            window.history.pushState({ drawer: 'CartDrawer' }, '');
        } else {
            isCartOpenRef.current = false;
            if (window.history.state?.drawer === 'CartDrawer') {
                window.history.back();
            }
        }
        setIsCartDrawerOpen(open);
    }, []);

    // Guardar en localStorage cuando cambia el carrito (saltar primer render para no sobrescribir)
    useEffect(() => {
        if (!isHydrated.current) {
            isHydrated.current = true;
            return;
        }
        localStorage.setItem('valex_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product, quantity = 1) => {
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
            icon: <ShoppingBag size={18} style={{ color: '#A68966' }} />,
            style: { backgroundColor: '#1e1e1f', border: '1px solid rgba(166,137,102,0.3)', color: '#F5F5F5' },
            closeIcon: <span className="text-valex-gris hover:text-white">×</span>
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        notification.info({
            message: 'Eliminado',
            description: 'Producto retirado de la bolsa.',
            placement: 'bottomRight',
            icon: <DeleteOutlined style={{ color: '#d9363e' }} />,
            style: { backgroundColor: '#1e1e1f', border: '1px solid #333', color: '#F5F5F5' }
        });
    }, []);

    const updateQuantity = useCallback((productId, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    }, [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen: handleSetIsCartDrawerOpen
    }), [
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        isCartDrawerOpen,
        handleSetIsCartDrawerOpen
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
