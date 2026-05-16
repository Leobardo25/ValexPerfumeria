import { ArrowDownCircle, ArrowUpCircle, TrendingUp, DollarSign } from 'lucide-react';

export default function MovementStats({ movements }) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthMovements = movements.filter(m => {
        const d = m.createdAt?.toDate?.() || m.createdAt;
        return d && d >= startOfMonth;
    });

    const entradasMes = monthMovements.filter(m => m.type === 'entrada');
    const salidasMes = monthMovements.filter(m => m.type === 'salida');

    const totalEntradas = entradasMes.reduce((sum, m) => sum + (m.quantity || 0), 0);
    const totalSalidas = salidasMes.reduce((sum, m) => sum + (m.quantity || 0), 0);

    const dineroEntradas = entradasMes.reduce((sum, m) => sum + (m.amount || 0), 0);
    const dineroSalidas = salidasMes.reduce((sum, m) => sum + (m.amount || 0), 0);

    const stats = [
        {
            label: 'Entradas del Mes',
            value: totalEntradas,
            subtitle: dineroEntradas > 0 ? `₡${dineroEntradas.toLocaleString()}` : null,
            icon: ArrowDownCircle,
            color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Salidas del Mes',
            value: totalSalidas,
            subtitle: dineroSalidas > 0 ? `₡${dineroSalidas.toLocaleString()}` : null,
            icon: ArrowUpCircle,
            color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
            valueColor: 'text-red-600 dark:text-red-400',
        },
        {
            label: 'Ingresos Ventas',
            value: `₡${dineroSalidas.toLocaleString()}`,
            subtitle: `${salidasMes.filter(m => m.reason === 'venta').length} ventas`,
            icon: DollarSign,
            color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
            valueColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Balance Unidades',
            value: `${totalEntradas - totalSalidas >= 0 ? '+' : ''}${totalEntradas - totalSalidas}`,
            subtitle: 'Entradas − Salidas',
            icon: TrendingUp,
            color: totalEntradas - totalSalidas >= 0 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
            valueColor: totalEntradas - totalSalidas >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {stats.map(s => {
                const Icon = s.icon;
                return (
                    <div key={s.label} className="bg-white dark:bg-[#1e1e20] rounded-xl border border-gray-200 dark:border-white/5 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{s.label}</p>
                            <div className={`p-1.5 rounded-lg ${s.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
                        {s.subtitle && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{s.subtitle}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
