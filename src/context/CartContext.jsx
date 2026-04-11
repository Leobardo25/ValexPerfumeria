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

        const productImage = product.galleryImages?.[0] || product.coverImage || product.imageUrl;
        
        notification.open({
            message: null,
            description: (
                <div className="flex items-center gap-4 -my-1">
                    {productImage ? (
                        <div className="w-12 h-12 rounded-lg border border-valex-bronce/20 overflow-hidden flex-shrink-0 shadow-lg">
                            <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#111] border border-valex-bronce/20 flex items-center justify-center flex-shrink-0 text-valex-bronce">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    )}
                    <div className="flex flex-col flex-1 justify-center">
                        <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-valex-bronce font-bold mb-1">
                            Añadido a la Bolsa
                        </span>
                        <span className="font-serif text-[13px] font-semibold text-valex-hueso leading-tight line-clamp-1">
                            {product.name}
                        </span>
                        <span className="font-sans text-[11px] text-valex-gris/60 mt-0.5 font-medium">
                            {quantity} {quantity === 1 ? 'unidad' : 'unidades'} • {product.category}
                        </span>
                    </div>
                </div>
            ),
            placement: 'bottomRight',
            icon: null,
            style: { 
                backgroundColor: 'rgba(21, 21, 21, 0.95)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid #A68966', 
                borderRadius: '16px',
                padding: '16px',
                width: '340px',
                boxShadow: '0 10px 30px -10px rgba(166,137,102,0.3)'
            },
            closeIcon: <span className="text-valex-gris/40 hover:text-valex-hueso transition-colors mt-2 text-[16px]">✕</span>,
            duration: 4,
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        notification.open({
            message: null,
            description: (
                <div className="flex items-center gap-4 -my-1">
                    <div className="w-12 h-12 rounded-lg bg-[#151515] border border-valex-gris/15 flex items-center justify-center flex-shrink-0 text-valex-gris/60 shadow-lg">
                        <DeleteOutlined className="text-[18px]" />
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                        <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-valex-gris font-bold mb-1">
                            Retirado
                        </span>
                        <span className="font-serif text-[13px] font-semibold text-valex-hueso leading-tight">
                            Producto Eliminado
                        </span>
                        <span className="font-sans text-[11px] text-valex-gris/60 mt-0.5 font-medium">
                            Se ha quitado de la bolsa
                        </span>
                    </div>
                </div>
            ),
            placement: 'bottomRight',
            icon: null,
            style: { 
                backgroundColor: 'rgba(21, 21, 21, 0.95)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(209,209,209,0.15)', 
                borderRadius: '16px',
                padding: '16px',
                width: '340px',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            },
            closeIcon: <span className="text-valex-gris/40 hover:text-valex-hueso transition-colors mt-2 text-[16px]">✕</span>,
            duration: 3,
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
