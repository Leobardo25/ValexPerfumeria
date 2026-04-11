import { createContext, useContext, useState, useEffect, useRef } from 'react';

const CheckoutDrawerContext = createContext();

export const CheckoutDrawerProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const isOpenRef = useRef(false);

    const openCheckoutDrawer = (data) => {
        setCheckoutData(data);
        setIsOpen(true);
        isOpenRef.current = true;
        window.history.pushState({ drawer: 'CheckoutDrawer' }, '');
    };

    const closeCheckoutDrawer = () => {
        isOpenRef.current = false;
        setIsOpen(false);
        if (window.history.state?.drawer === 'CheckoutDrawer') {
            window.history.back();
        }
        setTimeout(() => setCheckoutData(null), 300);
    };

    useEffect(() => {
        const handlePopState = () => {
            if (isOpenRef.current) {
                isOpenRef.current = false;
                setIsOpen(false);
                setTimeout(() => setCheckoutData(null), 300);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []); // Sin dependencias: usa ref para evitar closure stale

    return (
        <CheckoutDrawerContext.Provider
            value={{
                isOpen,
                checkoutData,
                openCheckoutDrawer,
                closeCheckoutDrawer
            }}
        >
            {children}
        </CheckoutDrawerContext.Provider>
    );
};

export const useCheckoutDrawer = () => {
    const context = useContext(CheckoutDrawerContext);
    if (!context) {
        throw new Error('useCheckoutDrawer must be used within CheckoutDrawerProvider');
    }
    return context;
};
