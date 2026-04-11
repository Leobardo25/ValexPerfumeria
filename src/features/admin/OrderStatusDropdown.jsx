import { useState, useRef, useEffect } from 'react';
import { updateOrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';

const STATUSES = ['nuevo', 'en proceso', 'entregado', 'cancelado'];

const DOT = {
    nuevo:        'bg-blue-500',
    'en proceso': 'bg-amber-500',
    entregado:    'bg-emerald-500',
    cancelado:    'bg-red-400',
};

const BADGE = {
    nuevo:        'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    'en proceso': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    entregado:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    cancelado:    'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
};

const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function OrderStatusDropdown({ orderId, currentStatus, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = async (status) => {
        if (status === currentStatus) { setOpen(false); return; }
        setLoading(true);
        setOpen(false);
        try {
            await updateOrderStatus(orderId, status);
            onUpdated(status);
            toast.success('Estado actualizado');
        } catch {
            toast.error('Error al actualizar estado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
                disabled={loading}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-75 ${BADGE[currentStatus] ?? 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'}`}
            >
                {label(currentStatus)}
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-30 bg-white dark:bg-[#252528] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg py-1 min-w-[150px]">
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); handleSelect(s); }}
                            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT[s]}`} />
                            <span className={s === currentStatus ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}>{label(s)}</span>
                            {s === currentStatus && <span className="ml-auto text-indigo-500 dark:text-indigo-400 text-[10px]">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
