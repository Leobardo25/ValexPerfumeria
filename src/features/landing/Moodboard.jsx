import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BRAND } from '../../constants'
import { VALEX_TRANSITION } from '../../constants/motion'
import useScrollReveal from '../../hooks/useScrollReveal'
import AboutContent from './AboutContent'

export default function Moodboard() {
    const { ref: headerRef, isInView: headerInView } = useScrollReveal(0.3)

    return (
        <section id="nosotros" className="relative py-24 sm:py-32 bg-valex-negro overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
            {/* Elementos decorativos del fondo */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-valex-bronce/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-valex-bronce/3 blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Header — scroll reveal */}
                <motion.div
                    ref={headerRef}
                    className="text-center mx-auto mb-10 lg:mb-20"
                    initial={{ opacity: 0, y: 25 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={VALEX_TRANSITION}
                >
                    <span className="inline-block text-valex-bronce font-sans font-medium text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6">
                        Nuestro Universo
                    </span>
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-valex-hueso leading-[1.1] mb-6">
                        El Lujo está en{' '}
                        <span className="text-valex-bronce italic font-medium">los Detalles</span>
                    </h2>
                    <p className="text-valex-gris/60 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                        {BRAND.description}
                    </p>
                </motion.div>

                {/* About content — expanded info (Los 3 pilares de la marca) */}
                <AboutContent />

                {/* Llamado a la Acción (CTA final hacia la tienda) */}
                <motion.div 
                    className="mt-24 flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 1 }}
                >
                    <Link to="/tienda" className="inline-flex items-center justify-center py-5 px-12 border border-valex-bronce bg-transparent text-valex-hueso font-sans hover:bg-valex-bronce hover:text-valex-negro transition-all duration-500 tracking-[0.2em] text-xs font-bold uppercase rounded-full shadow-lg hover:shadow-valex-bronce/20 group">
                        <span>Ingresar a la Tienda</span>
                        <svg className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
