import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Star, AlertTriangle, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getOrders } from '../../services/orderService';

const StatCard = ({ label, value, icon: Icon, color, linkTo, loading }) => (
    <div className="bg-white dark:bg-[#1e1e20] rounded-xl border border-gray-200 dark:border-white/5 p-5 shadow-sm hover:shadow-md dark:hover:border-white/10 transition-all">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                {loading ? (
                    <div className="h-8 w-16 mt-2 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
                ) : (
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
                )}
            </div>
            <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        {linkTo && (
            <Link to={linkTo} className="mt-4 inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Ver detalle <ArrowRight className="w-3 h-3" />
            </Link>
        )}
    </div>
);

export default function AdminHome() {
    const [stats, setStats] = useState({ total: 0, featured: 0, outOfStock: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [products, orders] = await Promise.all([getProducts(), getOrders()]);
                setStats({
                    total: products.length,
                    featured: products.filter(p => p.isFeatured).length,
                    outOfStock: products.filter(p => p.stock === 'Bóveda (Retirado)').length,
                    orders: orders.length,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-500 mt-1 text-sm">Resumen general de la tienda.</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Productos" value={stats.total} icon={Package} color="bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" linkTo="/admin/inventory" loading={loading} />
                <StatCard label="Destacados" value={stats.featured} icon={Star} color="bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400" linkTo="/admin/inventory" loading={loading} />
                <StatCard label="Retirados" value={stats.outOfStock} icon={AlertTriangle} color="bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400" linkTo="/admin/inventory" loading={loading} />
                <StatCard label="Pedidos" value={stats.orders} icon={ShoppingBag} color="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" linkTo="/admin/orders" loading={loading} />
            </div>
        </div>
    );
}
