import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { FaUser } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS } from '../../constants'
import { VALEX_TRANSITION } from '../../constants/motion'

export default function Navbar({ menuOpen, setMenuOpen }) {
    const [scrolled, setScrolled] = useState(false)
    const { currentUser, userData, logout } = useAuth()
    const [isHoveringUser, setIsHoveringUser] = useState(false)
    const hoverTimeoutRef = useRef(null)
    const location = useLocation()

    // Comprobar si estamos en la Landing (hash links funcionan localmente) de lo contrario redirigir a /#hash
    const isHomePage = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const getLinkHref = (hash) => {
        return isHomePage ? hash : `/${hash}`
    }

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        setIsHoveringUser(true)
    }

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => setIsHoveringUser(false), 250)
    }

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={VALEX_TRANSITION}
            >
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        backgroundColor: scrolled ? 'rgba(26, 26, 27, 0.95)' : 'rgba(26, 26, 27, 0)',
                        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
                        borderBottom: scrolled ? '1px solid rgba(209, 209, 209, 0.1)' : '1px solid rgba(209, 209, 209, 0)',
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="group">
                            <span className="font-serif font-bold text-2xl sm:text-3xl tracking-[0.15em] animate-shimmer">
                                VALEX
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={getLinkHref(link.href)}
                                    className="relative text-valex-gris hover:text-valex-hueso font-sans font-medium text-sm tracking-wide px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-white/5"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...VALEX_TRANSITION, delay: 0.1 + i * 0.05 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <div className="flex items-center gap-6 ml-6 border-l border-valex-gris/10 pl-6 h-full py-4">
                                {/* Botón Dorado CATAÁLOGO movido a la izquierda de la personita */}
                                <Link
                                    to="/tienda"
                                    className="bg-valex-bronce text-valex-negro font-sans font-semibold text-sm px-7 py-2.5 rounded-lg shadow-lg hover:shadow-valex-bronce/30 hover:bg-valex-bronce-dark transition-all duration-300"
                                >
                                    Ir a la Tienda
                                </Link>

                                {/* Menú Hover Sutil de Usuario */}
                                <div 
                                    className="relative flex items-center h-full"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        to={currentUser ? (userData?.role === 'admin' ? '/admin' : '/') : '/login'}
                                        className="text-valex-gris hover:text-valex-bronce transition-colors p-2 rounded-full hover:bg-valex-bronce/10 flex items-center justify-center cursor-pointer"
                                        aria-label="Perfil"
                                    >
                                        <FaUser className="w-[18px] h-[18px]" />
                                    </Link>

                                    <AnimatePresence>
                                        {isHoveringUser && currentUser && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-[40px] w-48 bg-[#1a1a1b] border border-valex-bronce/20 rounded-xl shadow-2xl py-2 z-50 pointer-events-auto before:content-[''] before:absolute before:-top-6 before:left-0 before:w-full before:h-6"
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="px-4 py-3 border-b border-valex-gris/10">
                                                    <p className="text-valex-hueso text-xs font-serif italic mb-0.5">Bienvenido,</p>
                                                    <p className="text-valex-bronce text-sm font-semibold truncate">{userData?.nombre || 'Usuario'}</p>
                                                </div>
                                                
                                                <div className="py-2">
                                                    {userData?.role === 'admin' && (
                                                        <Link to="/admin" className="block px-4 py-2 text-sm text-valex-gris hover:text-valex-hueso hover:bg-white/5 transition-colors">
                                                            Panel de Gestión
                                                        </Link>
                                                    )}
                                                    <button 
                                                        onClick={() => logout()}
                                                        className="w-full text-left px-4 py-2 text-sm text-valex-gris hover:text-red-400 hover:bg-white/5 transition-colors"
                                                    >
                                                        Cerrar sesión
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-valex-gris hover:text-valex-hueso p-2 rounded-lg hover:bg-white/10 transition-colors z-50"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 z-40 bg-valex-negro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between px-4 h-20 border-b border-valex-gris/10">
                                <Link to="/" onClick={() => setMenuOpen(false)}>
                                    <span className="font-serif font-bold text-2xl tracking-[0.15em]">VALEX</span>
                                </Link>
                                <button onClick={() => setMenuOpen(false)} className="text-valex-gris hover:text-valex-hueso p-2 rounded-lg" aria-label="Close menu">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="h-[1px] bg-valex-bronce/20" />
                            
                            <div className="flex-1 flex flex-col items-center py-10 gap-6 overflow-y-auto">
                                {/* Nav Links */}
                                {NAV_LINKS.map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={getLinkHref(link.href)}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-valex-gris hover:text-valex-bronce font-serif font-bold text-3xl tracking-wide transition-colors duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ ...VALEX_TRANSITION, delay: 0.1 + i * 0.08 }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                                
                                <div className="w-full px-8 mt-6 max-w-sm flex flex-col gap-4">
                                    {/* Botón de Tienda para celular */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...VALEX_TRANSITION, delay: 0.5 }}>
                                        <Link to="/tienda" onClick={() => setMenuOpen(false)} className="flex items-center justify-center bg-valex-bronce text-valex-negro font-sans font-bold px-6 py-4 rounded-full w-full shadow-lg">
                                            Ir a la Tienda Completa
                                        </Link>
                                    </motion.div>

                                    {/* Login Status for Mobile */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...VALEX_TRANSITION, delay: 0.6 }}>
                                        {currentUser ? (
                                            <div className="border border-valex-bronce/30 rounded-3xl p-4 bg-valex-bronce/5">
                                                <p className="text-center text-valex-hueso text-sm mb-4">Bienvenido, {userData?.nombre}</p>
                                                {userData?.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 text-valex-bronce mb-3 text-sm">
                                                        <FaUser /> Panel de Gestión
                                                    </Link>
                                                )}
                                                <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-center text-red-400 text-sm">
                                                    Cerrar sesión
                                                </button>
                                            </div>
                                        ) : (
                                            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-3 text-valex-bronce font-sans font-medium px-6 py-3 rounded-full hover:bg-valex-bronce/10 border border-valex-bronce/30 transition-colors">
                                                <FaUser className="w-5 h-5" />
                                                <span>Acceso a Cuenta</span>
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
