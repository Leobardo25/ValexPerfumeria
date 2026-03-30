import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import Navbar from '../components/layout/Navbar'
import Hero from '../features/landing/Hero'
import FeaturedProducts from '../features/landing/FeaturedProducts'
import Moodboard from '../features/landing/Moodboard'
import Footer from '../components/layout/Footer'

export default function Landing() {
    const [showFloatingBtn, setShowFloatingBtn] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingBtn(window.scrollY > window.innerHeight * 0.3)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-valex-negro overflow-x-hidden">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            
            <main>
                <Hero />
                <FeaturedProducts />
                <Moodboard />
            </main>
            
            <Footer />

            {/* Floating WhatsApp button — animated entrance */}
            <AnimatePresence>
                {showFloatingBtn && !menuOpen && (
                    <motion.a
                        href="https://wa.me/50660286150"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-6 right-4 z-30 flex items-center justify-center w-14 h-14 bg-valex-bronce rounded-full animate-glow-pulse hover:scale-110 transition-transform duration-500 ease-out shadow-xl"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        aria-label="Contactar por WhatsApp"
                    >
                        <FaWhatsapp className="w-7 h-7 text-valex-negro" />
                    </motion.a>
                )}
            </AnimatePresence>
        </div>
    )
}
