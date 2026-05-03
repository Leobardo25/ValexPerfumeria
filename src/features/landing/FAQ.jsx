import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getSiteConfig } from '../../services/siteConfigService'
import { VALEX_TRANSITION } from '../../constants/motion'
import useScrollReveal from '../../hooks/useScrollReveal'

const DEFAULT_FAQS = [
    {
        question: '¿Son originales los perfumes que venden?',
        answer: 'En VALEX, garantizamos un 100% de autenticidad en cada uno de nuestros productos. Sabemos que comprar fragancias online puede generar dudas, y para nosotros la reputación es la clave para sobresalir y mantenernos en esta industria a largo plazo. No estamos aquí para el corto plazo; queremos construir una relación de confianza y excelencia con nuestros clientes. Tu confianza es nuestra prioridad, y en VALEX puedes comprar con total tranquilidad.'
    },
    {
        question: '¿Hacen envíos a todo Costa Rica?',
        answer: '¡Sí! Realizamos envíos a cualquier lugar de Costa Rica mediante Correos CR y mensajería privada en la zona de occidente, nada más. Nos esforzamos por entregarte tu fragancia favorita en el menor tiempo posible y en perfectas condiciones.'
    },
    {
        question: '¿Cómo puedo realizar un pedido?',
        answer: 'Puedes realizar tu pedido directamente desde nuestra tienda online añadiendo los productos a tu bolsa, o si prefieres una atención más personalizada, contáctanos por WhatsApp y con gusto te asesoramos para encontrar la fragancia perfecta para ti.'
    }
]

export default function FAQ() {
    const [faqs, setFaqs] = useState(DEFAULT_FAQS)
    const [openIndex, setOpenIndex] = useState(null)
    const { ref: headerRef, isInView: headerInView } = useScrollReveal(0.3)

    useEffect(() => {
        getSiteConfig('faq').then((data) => {
            if (data?.items?.length > 0) {
                setFaqs(data.items)
            }
        })
    }, [])

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }

    return (
        <section id="faq" className="relative py-12 sm:py-16 bg-valex-negro overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-valex-bronce/3 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-valex-bronce/5 blur-[80px] pointer-events-none" />

            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Header */}
                <motion.div
                    ref={headerRef}
                    className="text-center mx-auto mb-16"
                    initial={{ opacity: 0, y: 25 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={VALEX_TRANSITION}
                >
                    <span className="inline-block text-valex-bronce font-sans font-medium text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6">
                        Resolvemos tus Dudas
                    </span>
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl text-valex-hueso leading-[1.1] mb-6">
                        Preguntas{' '}
                        <span className="text-valex-bronce italic font-medium">Frecuentes</span>
                    </h2>
                    <p className="text-valex-gris/60 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
                        Todo lo que necesitas saber antes de elegir tu fragancia perfecta.
                    </p>
                </motion.div>

                {/* Acordeones */}
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08, duration: 0.5 }}
                        >
                            <div
                                className={`rounded-2xl border transition-all duration-500 ${
                                    openIndex === idx
                                        ? 'bg-[#1e1e1f] border-valex-bronce/30 shadow-[0_4px_30px_rgba(166,137,102,0.08)]'
                                        : 'bg-transparent border-valex-gris/10 hover:border-valex-bronce/20'
                                }`}
                            >
                                {/* Pregunta */}
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                                >
                                    <span className={`font-sans font-semibold text-sm sm:text-base transition-colors duration-300 ${
                                        openIndex === idx ? 'text-valex-bronce' : 'text-valex-hueso'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                                            openIndex === idx ? 'text-valex-bronce' : 'text-valex-gris/40'
                                        }`} />
                                    </motion.div>
                                </button>

                                {/* Respuesta */}
                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6">
                                                <div className="h-px bg-valex-bronce/15 mb-5" />
                                                <p className="text-valex-gris/70 text-sm font-light leading-relaxed whitespace-pre-line">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
            </div>
            </div>
        </section>
    )
}
