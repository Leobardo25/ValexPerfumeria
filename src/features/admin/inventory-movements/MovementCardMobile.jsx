import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { MOVEMENT_TYPES } from '../../../services/movementService';

const formatDate = (d) => {
    const date = d?.toDate?.() || d;
    if (!date) return '—';
    return date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getReasonLabel = (type, reasonValue) => {
    const reasons = MOVEMENT_TYPES[type]?.reasons || [];
    return reasons.find(r => r.value === reasonValue)?.label || reasonValue;
};

export default function MovementCardMobile({ movement }) {
    const isEntrada = movement.type === 'entrada';
    const Icon = isEntrada ? ArrowDownCircle : ArrowUpCircle;

    return (
        <div className="bg-white dark:bg-[#1e1e20] rounded-xl border border-gray-200 dark:border-white/5 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isEntrada
                        ? 'bg-emerald-50 dark:bg-emerald-500/15'
                        : 'bg-red-50 dark:bg-red-500/15'
                }`}>
                    <Icon className={`w-5 h-5 ${
                        isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isEntrada
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                        }`}>
                            {isEntrada ? 'Entrada' : 'Salida'}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatDate(movement.createdAt)}
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {movement.productName || 'Producto'}
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {getReasonLabel(movement.type, movement.reason)}
                        </span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                        <span className={`text-xs font-bold ${
                            isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                            {isEntrada ? '+' : '-'}{movement.quantity} ud.
                        </span>
                        {movement.amount > 0 && (
                            <>
                                <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                                <span className={`text-xs font-bold ${
                                    isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {movement.currency === 'CRC' ? '₡' : '$'}{Number(movement.amount).toLocaleString()}
                                </span>
                            </>
                        )}
                        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-[10px] text-gray-400">
                            {movement.previousStock ?? '?'} → {movement.newStock ?? '?'}
                        </span>
                    </div>

                    {movement.notes && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 italic line-clamp-2">
                            {movement.notes}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
