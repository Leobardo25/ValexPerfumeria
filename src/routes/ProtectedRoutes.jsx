import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Loader component
const AuthLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-valex-negro">
        <div className="w-10 h-10 border-4 border-valex-bronce/30 border-t-valex-bronce rounded-full animate-spin"></div>
        <p className="mt-4 text-valex-gris font-sans tracking-widest text-sm uppercase">Autenticando...</p>
    </div>
);

// 2. ProtectedRoute: Only allowed for logged-in users (any role)
export const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) return <AuthLoader />;
    
    // If not logged in, redirect to login page keeping intended destination
    if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
    
    return <Outlet />;
};

// 3. AdminRoute: Only allowed for users who have role === 'admin' in Firestore
export const AdminRoute = () => {
    const { userData, loading } = useAuth();
    
    if (loading) return <AuthLoader />;
    
    // If logged in but not an admin, kick them back to home/shop
    if (userData?.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};

// 4. PublicOnlyRoute: Prevents logged in users from seeing the Login/Register page
export const PublicOnlyRoute = () => {
    const { currentUser, userData, loading } = useAuth();
    
    if (loading) return <AuthLoader />;
    
    // If already logged in, redirect to admin (if admin) or home (if user)
    if (currentUser) {
        return <Navigate to={userData?.role === 'admin' ? '/admin' : '/'} replace />;
    }
    
    return <Outlet />;
};
