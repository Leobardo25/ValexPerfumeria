import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import BeforeAfter from './components/BeforeAfter'
import Pricing from './components/Pricing'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

export default function App() {
    const [showFloatingBtn, setShowFloatingBtn] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show floating button as soon as user scrolls past the first screen
            setShowFloatingBtn(window.scrollY > window.innerHeight * 0.3)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Hero />
            <Services />
            <BeforeAfter />
            <Pricing />
            <Gallery />
            <Footer />

            {/* Floating WhatsApp button - hidden when mobile menu is open */}
            <a
                href="https://wa.me/yournumber"
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-6 right-4 z-30 flex items-center justify-center w-16 h-16 
          bg-gradient-to-br from-deep-purple via-electric-purple to-electric-purple rounded-full 
          animate-glow-pulse hover:scale-110 transition-all duration-500 ease-out
          ${showFloatingBtn && !menuOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <FaWhatsapp className="w-8 h-8 text-white" />
            </a>
        </div>
    )
}
