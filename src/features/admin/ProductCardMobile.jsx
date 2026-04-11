import { Star, Edit2, Trash2, Package } from 'lucide-react';
import { getProductImage, formatPrice } from './inventoryUtils';
import StatusDropdown from './StatusDropdown';
import QuantityControl from './QuantityControl';

export default function ProductCardMobile({ product: p, onEdit, onDelete, onStatusUpdated, onQuantityUpdated }) {
    return (
        <div className="bg-white dark:bg-[#1e1e20] border border-gray-200 dark:border-white/5 rounded-xl shadow-sm p-4">
            {/* Fila superior: imagen + info + acciones */}
            <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-gray-100 dark:bg-[#1A1A1B] rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5 flex items-center justify-center">
                    {getProductImage(p)
                        ? <img src={getProductImage(p)} alt={p.name} className="w-full h-full object-contain" />
                        : <Package className="w-5 h-5 text-gray-400" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{p.name}</p>
                        {p.isFeatured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.category} · {formatPrice(p.price, p.currency)}</p>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={onEdit} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Fila inferior: cantidad + estado */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                <QuantityControl
                    productId={p.id}
                    quantity={p.quantity ?? 0}
                    onUpdated={onQuantityUpdated}
                />
                <StatusDropdown
                    productId={p.id}
                    currentStatus={p.stock || 'Disponible'}
                    onUpdated={onStatusUpdated}
                />
            </div>
        </div>
    );
}
