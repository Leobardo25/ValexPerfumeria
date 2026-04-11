import { getTagStyle } from './tagUtils';

export default function CustomerFilters({ customers, allTags, activeFilter, onFilterChange }) {
    // Calcula conteos (solo la etiqueta principal [0])
    const counts = { 'null': customers.length };
    
    customers.forEach(currentCustomer => {
        const primaryTag = (currentCustomer.tags && currentCustomer.tags.length > 0) ? currentCustomer.tags[0] : 'Sin etiqueta';
        counts[primaryTag] = (counts[primaryTag] || 0) + 1;
    });

    const tagsToRender = [null, 'Sin etiqueta', ...allTags.filter(t => t !== 'Sin etiqueta')];

    return (
        <div className="flex flex-wrap gap-2 mb-5">
            {tagsToRender.map(tagVal => {
                // tagVal null = Todos
                const label = tagVal === null ? 'Todos' : tagVal;
                const isActive = activeFilter === tagVal;
                const n = counts[tagVal] || 0;
                
                // Si es "Todos" usamos un estilo neutral fijo
                const style = tagVal === null 
                    ? { bg: 'bg-gray-100 dark:bg-white/5', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-200 dark:border-white/10', dot: 'bg-gray-400 dark:bg-gray-500' }
                    : getTagStyle(tagVal);

                return (
                    <button
                        key={label}
                        onClick={() => onFilterChange(tagVal)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                            isActive
                                ? `${style.bg} ${style.text} border-transparent ring-2 ring-indigo-500/30`
                                : `bg-white dark:bg-[#1e1e20] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20`
                        }`}
                    >
                        {tagVal !== null && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                        {label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                            isActive ? 'bg-white/40 dark:bg-black/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                        }`}>
                            {n}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
