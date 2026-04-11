import { Inbox, Clock, PackageCheck, XCircle } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

const STATS = [
    { label: 'Nuevo',      value: 'nuevo',        icon: Inbox,        ring: 'ring-blue-200 dark:ring-blue-500/30',    bg: 'bg-blue-50 dark:bg-blue-500/15',    text: 'text-blue-600 dark:text-blue-400',    iconBg: 'bg-blue-100 dark:bg-blue-500/15'    },
    { label: 'En proceso', value: 'en proceso',   icon: Clock,        ring: 'ring-amber-200 dark:ring-amber-500/30',   bg: 'bg-amber-50 dark:bg-amber-500/15',   text: 'text-amber-600 dark:text-amber-400',   iconBg: 'bg-amber-100 dark:bg-amber-500/15'   },
    { label: 'Entregado',  value: 'entregado',    icon: PackageCheck, ring: 'ring-emerald-200 dark:ring-emerald-500/30', bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-500/15' },
    { label: 'Cancelado',  value: 'cancelado',    icon: XCircle,      ring: 'ring-red-200 dark:ring-red-500/30',     bg: 'bg-red-50 dark:bg-red-500/15',     text: 'text-red-500 dark:text-red-400',     iconBg: 'bg-red-100 dark:bg-red-500/15'     },
];

const formatAmount = (amount, currency) => {
    if (currency === 'CRC') return `₡${Math.round(amount).toLocaleString('es-CR')}`;
    return `$${amount.toFixed(2)}`;
};

const sumOrders = (orders, status, currency) =>
    orders
        .filter(o => o.status === status)
        .reduce((acc, order) => {
            const subtotal = (order.items || [])
                .filter(item => item.currency === currency)
                .reduce((s, item) => s + Number(item.price) * Number(item.quantity), 0);
            return acc + subtotal;
        }, 0);

export default function OrderStats({ orders, activeFilter, onFilterChange }) {
    const { storeCurrency } = useSiteConfig();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {STATS.map(({ label, value, icon: Icon, ring, bg, text, iconBg }) => {
                const count = orders.filter(o => o.status === value).length;
                const total = sumOrders(orders, value, storeCurrency);
                const isActive = activeFilter === value;

                return (
                    <button
                        key={value}
                        onClick={() => onFilterChange(isActive ? null : value)}
                        className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                            isActive
                                ? `border-transparent ring-2 ${ring} ${bg}`
                                : 'border-gray-200 dark:border-white/5 bg-white dark:bg-[#1e1e20] hover:border-gray-300 dark:hover:border-white/10'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                                <Icon className={`w-4 h-4 ${text}`} />
                            </div>
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? text : 'text-gray-500'}`}>
                                {label}
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-none">{count}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {count === 1 ? 'pedido' : 'pedidos'}
                            </p>
                        </div>
                        <p className={`text-sm font-semibold ${total > 0 ? text : 'text-gray-300 dark:text-gray-600'}`}>
                            {total > 0 ? formatAmount(total, storeCurrency) : '—'}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}
