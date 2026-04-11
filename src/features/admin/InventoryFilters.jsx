import { Star } from 'lucide-react';

const FILTERS = [
    { label: 'Todos',      value: null },
    { label: 'Disponible', value: 'Disponible' },
    { label: 'Agotado',    value: 'Agotado' },
    { label: 'Retirado',   value: 'Bóveda (Retirado)' },
    { label: 'Destacados', value: '__featured__' },
];

export default function InventoryFilters({ activeFilter, onFilterChange }) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map(({ label, value }) => {
                const isActive = activeFilter === value;
                return (
                    <button
                        key={label}
                        onClick={() => onFilterChange(value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            isActive
                                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                                : 'bg-white dark:bg-[#1e1e20] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                    >
                        {value === '__featured__' && <Star className="w-3 h-3" />}
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
