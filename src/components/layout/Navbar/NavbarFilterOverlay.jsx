import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function NavbarFilterOverlay({ isFilterMenuOpen, onToggleMobileFilters, mobileFiltersNode }) {
    if (!isFilterMenuOpen) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100dvh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden w-screen fixed inset-0 bg-[rgba(26,26,27,0.98)] md:bg-[#151515]/98 backdrop-blur-xl shadow-2xl z-[60] flex flex-col"
        >
            <div className="pt-16 pb-6 h-full flex flex-col w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="text-valex-hueso font-serif text-2xl tracking-widest mt-2">FILTROS</h2>
                    <button 
                        onClick={onToggleMobileFilters}
                        className="text-valex-gris hover:text-valex-hueso p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
                    {mobileFiltersNode}
                </div>
            </div>
        </motion.div>
    );
}
