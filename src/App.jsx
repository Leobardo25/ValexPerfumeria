import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Protected Routes Higher Order Components
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './routes/ProtectedRoutes';

// Pages & Components Custom
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InventoryList from './features/admin/InventoryList';
import ProductForm from './features/admin/ProductForm';

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Store & Landing Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/tienda" element={<Shop />} />

      {/* 2. Authentication Pages (blocked if logged in) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* 3. Protected Generic Routes (must be logged in) */}
      <Route element={<ProtectedRoute />}>
      </Route>

      {/* 4. Admin Only Routes */}
      <Route element={<AdminRoute />}>
        {/* The Dashboard acts as a Layout/Shell */}
        <Route path="/admin" element={<AdminDashboard />}>
           {/* /admin exact matches Dashboard default view handled inside the component */}
           <Route path="inventory" element={<InventoryList />} />
           <Route path="products/new" element={<ProductForm />} />
           <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>
      </Route>

      {/* 5. Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={false} 
          theme="dark" 
          toastClassName="bg-[#1e1e1f] text-valex-hueso border border-valex-bronce/30 font-sans"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
