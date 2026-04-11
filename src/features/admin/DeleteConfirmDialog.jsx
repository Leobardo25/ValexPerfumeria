import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmDialog({ productName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                className="relative bg-white dark:bg-[#1e1e20] rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100 dark:border-white/10"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
            >
                <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Eliminar producto</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            ¿Seguro que quieres eliminar <span className="font-semibold text-gray-700 dark:text-gray-200">"{productName}"</span>?
                            Esta acción es permanente y no se puede deshacer.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Sí, eliminar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
