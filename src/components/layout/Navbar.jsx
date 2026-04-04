import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, User, Search, SlidersHorizontal, LayoutGrid, AlignJustify } from 'lucide-react'
import { FaUser } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { NAV_LINKS } from '../../constants'
import { VALEX_TRANSITION } from '../../constants/motion'

import Logo from '../ui/Logo'

export default function Navbar({ 
    menuOpen, 
    setMenuOpen, 
    shopSearchQuery = '', 
    setShopSearchQuery = () => {}, 
    onToggleMobileFilters = () => {}, 
    hasActiveFilters = false,
    isFilterMenuOpen = false,
    mobileFiltersNode = null,
    isCompactView = false,
    setIsCompactView = () => {}
}) {
    const [scrolled, setScrolled] = useState(false)
    const { currentUser, userData, logout } = useAuth()
    const { cartItems, setIsCartDrawerOpen } = useCart()
    const [isHoveringUser, setIsHoveringUser] = useState(false)
    const hoverTimeoutRef = useRef(null)
    const location = useLocation()
    const isShopPage = location.pathname === '/tienda'

    // Comprobar si estamos en la Landing (hash links funcionan localmente) de lo contrario redirigir a /#hash
    const isHomePage = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = (menuOpen || isFilterMenuOpen) ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen, isFilterMenuOpen])

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
                    <div className="flex items-center justify-between h-20 relative text-valex-hueso">
                        {/* Mobile left: Hamburger Menu */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-valex-gris hover:text-valex-hueso p-2 -ml-2 rounded-lg transition-colors z-50"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Mobile center: Logo | Desktop left: Logo */}
                        <div className="md:hidden absolute left-1/2 -translate-x-1/2 mt-1">
                            <Link to="/" className="group">
                                <Logo className="text-[1.3rem]" />
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <Link to="/" className="group">
                                <Logo className="text-3xl" />
                            </Link>
                        </div>

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
                            <div className="flex items-center gap-4 ml-6 border-l border-valex-gris/10 pl-6 h-full py-4">
                                {/* En /tienda: barra de búsqueda inline + filtros | Cualquier otro sitio: botón dorado */}
                                {isShopPage ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-56 xl:w-72 bg-[#151515] border border-valex-gris/20 rounded-lg h-9 flex items-center px-3 focus-within:border-valex-bronce transition-colors">
                                            <Search className="w-3.5 h-3.5 text-valex-gris mr-2 flex-shrink-0" />
                                            <input 
                                                type="text"
                                                value={shopSearchQuery}
                                                onChange={(e) => setShopSearchQuery(e.target.value)}
                                                placeholder="Buscar..."
                                                className="w-full bg-transparent text-valex-hueso text-xs focus:outline-none placeholder:text-valex-gris/50"
                                                style={{ WebkitAppearance: 'none' }}
                                            />
                                            {shopSearchQuery && (
                                                <button onClick={() => setShopSearchQuery('')} className="text-valex-gris hover:text-valex-hueso ml-1 flex-shrink-0">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={onToggleMobileFilters}
                                            className={`h-9 px-4 border text-[10px] font-bold uppercase tracking-widest font-serif flex items-center justify-center rounded-lg transition-all duration-300 ${
                                                isFilterMenuOpen 
                                                    ? 'bg-valex-bronce text-valex-negro border-valex-bronce' 
                                                    : 'bg-transparent border-valex-gris/20 text-valex-gris hover:text-valex-bronce hover:border-valex-bronce/50'
                                            }`}
                                        >
                                            {isFilterMenuOpen ? <X className="w-3.5 h-3.5 mr-1.5" /> : <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />}
                                            Filtros{hasActiveFilters && !isFilterMenuOpen && ' •'}
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/tienda"
                                        className="bg-valex-bronce text-valex-negro font-sans font-semibold text-sm px-7 py-2.5 rounded-lg shadow-lg hover:shadow-valex-bronce/30 hover:bg-valex-bronce-dark transition-all duration-300"
                                    >
                                        Ir a la Tienda
                                    </Link>
                                )}

                                {/* Cart Button Desktop */}
                                <button 
                                    onClick={() => setIsCartDrawerOpen(true)}
                                    className="relative text-valex-gris hover:text-valex-bronce transition-colors p-2 rounded-full hover:bg-valex-bronce/10 flex items-center justify-center cursor-pointer"
                                    aria-label="Carrito"
                                >
                                    <ShoppingBag className="w-[18px] h-[18px]" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-[#d9363e] text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </button>

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

                        {/* Mobile right: Shortcut Icons */}
                        <div className="md:hidden flex items-center gap-2">
                            <button onClick={() => { setIsCartDrawerOpen(true); setMenuOpen(false); }} className="relative text-valex-bronce hover:text-valex-hueso transition-colors p-2" aria-label="Carrito">
                                <ShoppingBag className="w-[20px] h-[20px]" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-[#d9363e] text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                            <Link to={currentUser ? (userData?.role === 'admin' ? '/admin' : '/') : '/login'} className="text-valex-bronce hover:text-valex-hueso transition-colors p-2 -mr-1" aria-label="Cuenta">
                                <User className="w-[20px] h-[20px]" />
                            </Link>
                        </div>
                    </div>
                    {/* INJECT: Tienda Toolbar SOLO para Móviles (oculto cuando el menú hamburguesa está abierto) */}
                    {location.pathname === '/tienda' && !menuOpen && (
                        <div className="md:hidden w-full px-4 pb-4 flex justify-center items-center gap-2 transition-all duration-300">
                             <div className="flex-1 bg-[#151515] border border-valex-bronce/30 rounded-lg h-11 flex items-center px-4 focus-within:border-valex-bronce shadow-inner">
                                 <Search className="w-4 h-4 text-valex-gris mr-3 flex-shrink-0" />
                                 <input 
                                     type="text"
                                     value={shopSearchQuery}
                                     onChange={(e) => setShopSearchQuery(e.target.value)}
                                     placeholder="Buscar..."
                                     className="w-full bg-transparent text-valex-hueso text-sm focus:outline-none placeholder:text-valex-gris/60"
                                     style={{ WebkitAppearance: 'none' }}
                                 />
                                 {shopSearchQuery && (
                                     <button onClick={() => setShopSearchQuery('')} className="text-valex-gris hover:text-valex-hueso ml-1 flex-shrink-0">
                                         <X className="w-3.5 h-3.5" />
                                     </button>
                                 )}
                             </div>

                             <button
                                 onClick={onToggleMobileFilters}
                                 className={`h-11 px-6 border text-[11px] sm:text-xs font-bold uppercase tracking-widest font-serif flex items-center justify-center rounded-lg transition-all duration-300 ${isFilterMenuOpen ? 'bg-valex-bronce text-valex-negro border-valex-bronce shadow-[0_0_15px_rgba(166,137,102,0.3)]' : 'bg-transparent border-valex-bronce/40 text-valex-hueso hover:text-valex-bronce hover:border-valex-bronce'}`}
                             >
                                 <AnimatePresence mode="wait">
                                     <motion.div
                                         key={isFilterMenuOpen ? "close" : "filter"}
                                         initial={{ opacity: 0, scale: 0.8 }}
                                         animate={{ opacity: 1, scale: 1 }}
                                         exit={{ opacity: 0, scale: 0.8 }}
                                         transition={{ duration: 0.15 }}
                                         style={{ display: 'flex', alignItems: 'center' }}
                                     >
                                         {isFilterMenuOpen ? <X className="w-4 h-4 mr-2" /> : <SlidersHorizontal className="w-4 h-4 mr-2" />}
                                     </motion.div>
                                 </AnimatePresence>
                                 <span className="hidden sm:inline">FILTROS {hasActiveFilters && !isFilterMenuOpen && '•'}</span>
                                 <span className="sm:hidden">FILTROS {hasActiveFilters && !isFilterMenuOpen && '•'}</span>
                             </button>

                             {/* Botón vista compacta/lista (solo móvil) */}
                             <button
                                 onClick={() => setIsCompactView(!isCompactView)}
                                 className="h-11 w-11 flex-shrink-0 border border-valex-bronce/40 rounded-lg flex items-center justify-center text-valex-hueso hover:text-valex-bronce hover:border-valex-bronce transition-all duration-300"
                                 aria-label="Cambiar vista"
                             >
                                 {isCompactView ? <AlignJustify className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                             </button>
                        </div>
                    )}

                    {/* INJECT: Filtros Acordeón (Slot Prop) integrados al Navbar como Fullscreen Overlay unificado */}
                    {location.pathname === '/tienda' && (
                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "100vh", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-y-auto md:overflow-hidden w-screen fixed inset-0 bg-[rgba(26,26,27,0.98)] md:bg-[#151515]/98 backdrop-blur-xl shadow-2xl z-[60]"
                                >
                                    <div className="pt-20 md:pt-16 pb-8 h-full flex flex-col w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                                        {/* Header del overlay */}
                                        <div className="flex items-center justify-between mb-6 md:mb-4 flex-shrink-0">
                                            <h2 className="text-valex-hueso font-serif text-2xl tracking-widest">FILTROS</h2>
                                            <button 
                                                onClick={onToggleMobileFilters}
                                                className="text-valex-gris hover:text-valex-hueso p-2 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        {/* Filters content - flex-1 to fill remaining space */}
                                        <div className="flex-1 min-h-0">
                                            {mobileFiltersNode}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 z-[100] bg-valex-negro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Solo botón de cerrar */}
                            <div className="flex justify-end px-4 pt-5">
                                <button onClick={() => setMenuOpen(false)} className="text-valex-gris hover:text-valex-hueso p-2 rounded-lg transition-colors" aria-label="Cerrar menú">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>
                            
                            <div className="flex-1 flex flex-col items-center justify-center pb-20 gap-8 overflow-y-auto">
                                {/* Nav Links */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...VALEX_TRANSITION, delay: 0.1 }}
                                >
                                    <Link 
                                        to="/tienda"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-valex-bronce font-serif font-medium text-4xl tracking-widest uppercase transition-colors duration-300 filter drop-shadow-[0_0_10px_rgba(166,137,102,0.4)]"
                                    >
                                        Ir a Tienda
                                    </Link>
                                </motion.div>
                                {NAV_LINKS.map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={getLinkHref(link.href)}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-valex-gris hover:text-valex-bronce font-serif font-light text-4xl tracking-widest uppercase transition-colors duration-300"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ ...VALEX_TRANSITION, delay: 0.1 + i * 0.08 }}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
