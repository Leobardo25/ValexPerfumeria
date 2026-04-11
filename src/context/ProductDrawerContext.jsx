import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ProductDrawerContext = createContext();

export function useProductDrawer() {
    return useContext(ProductDrawerContext);
}

export const ProductDrawerProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const isOpenRef = useRef(false);

    const openProductDrawer = (product) => {
        setSelectedProduct(product);
        setIsOpen(true);
        isOpenRef.current = true;
        window.history.pushState({ drawer: 'ProductDrawer' }, '');
    };

    const closeProductDrawer = () => {
        isOpenRef.current = false;
        setIsOpen(false);
        if (window.history.state?.drawer === 'ProductDrawer') {
            window.history.back();
        }
        setTimeout(() => setSelectedProduct(null), 300);
    };

    // Escuchar el evento popstate (botón atrás nativo)
    // Usamos ref para evitar el problema de closure stale
    useEffect(() => {
        const handlePopState = () => {
            if (isOpenRef.current) {
                isOpenRef.current = false;
                setIsOpen(false);
                setTimeout(() => setSelectedProduct(null), 300);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Sin dependencias: usa ref para el valor actualizado

    const value = {
        isOpen,
        selectedProduct,
        openProductDrawer,
        closeProductDrawer
    };

    return (
        <ProductDrawerContext.Provider value={value}>
            {children}
        </ProductDrawerContext.Provider>
    );
}
