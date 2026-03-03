import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'

const navLinks = [
    { href: '#services', label: 'Servicios' },
    { href: '#prices', label: 'Precios' },
    { href: '#gallery', label: 'Galería' },
]

import logoImg from '../img/logo/29e760ed-e1d4-4a3e-afff-2e1ab2a25cfc.jpeg'

export default function Navbar({ menuOpen, setMenuOpen }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-charcoal/80 backdrop-blur-xl shadow-2xl shadow-deep-purple/10 border-b border-white/5'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-electric-purple/30 shadow-lg shadow-electric-purple/20 group-hover:shadow-electric-purple/40 transition-shadow duration-300">
                                <img src={logoImg} alt="Chamo Barber Studio Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight animate-gradient-text uppercase">
                                CHAMO BS
                            </span>
                        </a>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-white/70 hover:text-white font-medium px-5 py-2 rounded-xl transition-colors duration-300 hover:bg-white/5"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                className="ml-4 bg-gradient-to-r from-deep-purple to-electric-purple text-white font-semibold px-6 py-2.5 rounded-2xl shadow-lg hover:shadow-electric-purple/40 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Cita
                            </a>
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors z-50"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile full-screen menu */}
            <div
                className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out ${menuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Solid background */}
                <div className="absolute inset-0 bg-charcoal" />

                <div className="relative h-full flex flex-col">
                    {/* Header with logo + close button */}
                    <div className="flex items-center justify-between px-4 h-20 border-b border-white/5">
                        <a href="#" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-electric-purple/30 shadow-lg shadow-electric-purple/20">
                                <img src={logoImg} alt="Chamo Barber Studio Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight animate-gradient-text uppercase">
                                CHAMO BS
                            </span>
                        </a>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Gradient accent line */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-electric-purple to-transparent" />

                    {/* Centered navigation links */}
                    <div className={`flex-1 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                        }`}>
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-white/80 hover:text-white font-display font-bold text-3xl tracking-wide hover:text-electric-purple transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        ))}

                        {/* WhatsApp CTA */}
                        <div className="mt-4" onClick={() => setMenuOpen(false)}>
                            <WhatsAppButton className="text-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
