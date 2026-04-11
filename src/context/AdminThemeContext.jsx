import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('valex-admin-dark') === 'true'; } catch { return false; }
    });
    const mountedRef = useRef(true);

    // Single effect: apply dark class and handle cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;

        localStorage.setItem('valex-admin-dark', dark);
        document.documentElement.classList.toggle('dark', dark);

        // Cleanup: only remove dark class when TRULY unmounting (leaving admin)
        return () => {
            mountedRef.current = false;
            // Small delay to let React StrictMode re-mount before we remove the class
            setTimeout(() => {
                if (!mountedRef.current) {
                    document.documentElement.classList.remove('dark');
                }
            }, 0);
        };
    }, [dark]);

    const toggle = useCallback(() => setDark(d => !d), []);
    
    const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);

    return (
        <AdminThemeContext.Provider value={value}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
