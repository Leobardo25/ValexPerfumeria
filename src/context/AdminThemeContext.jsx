import { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('valex-admin-dark') === 'true'; } catch { return false; }
    });

    useEffect(() => {
        localStorage.setItem('valex-admin-dark', dark);
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Cleanup: remove dark class when leaving admin to avoid leaking to public pages
        return () => document.documentElement.classList.remove('dark');
    }, [dark]);

    const toggle = () => setDark(d => !d);

    return (
        <AdminThemeContext.Provider value={{ dark, toggle }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
