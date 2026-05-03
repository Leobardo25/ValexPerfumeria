import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import { HERO_CONTENT } from '../../constants'
import { useSiteConfig } from '../../context/SiteConfigContext'
import { heroReveal, fadeInUp, VALEX_TRANSITION, VALEX_SLOW } from '../../constants/motion'

export default function Hero() {
    return (
        <section className="relative min-h-[100dvh] w-full bg-valex-negro flex flex-col items-center justify-center overflow-hidden snap-start pt-24 pb-16 lg:py-0">
            
            {/* Background Video (Local) - Aplicado Desenfoque Bokeh para Enmascarar la Marca */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover select-none blur-[4px] scale-105"
                    src="/videos/18s-hero.mp4"
                />
                
                {/* Gradient oscuro sobre el lente desenfocado para dar el efecto de "esmerilado negro" */}
                <div className="absolute inset-0 bg-gradient-to-b from-valex-negro/50 via-valex-negro/75 to-valex-negro/95 pointer-events-none" />
                
                {/* Textura sutil y viñeta en negro profundo */}
                <div className="absolute inset-0 bg-black/30 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto mt-0 lg:-mt-16 pb-12 lg:pb-0">
                <HeroBadge />
                <HeroTitle />
                <div className="w-16 h-[1px] bg-valex-bronce/30 my-8 shadow-sm" />
                <HeroSubtitle />
                <HeroCTA />
                
                {/* Redes Móviles Integradas (Inmediatamente debajo del CTA para evitar problemas de Overflow/Scroll) */}
                <div className="flex justify-center mt-6 lg:hidden w-full">
                    <HeroSocials />
                </div>
                
                {/* Redes flotantes en Desktop */}
                <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-6 mr-8">
                    <HeroSocials vertical />
                </div>
            </div>

            {/* Scroll Indicator - Habilitado para todas las resoluciones (Mobile + Desktop) */}
            <motion.div 
                className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => document.getElementById('colecciones')?.scrollIntoView({ behavior: 'smooth' })}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 1 }}
            >
                <span className="text-valex-hueso/50 text-[10px] uppercase tracking-[0.3em] font-sans group-hover:text-valex-bronce transition-colors">Descubre</span>
                <div className="w-[1px] h-12 bg-valex-bronce/30 relative overflow-hidden">
                    <motion.div 
                        className="w-full h-full bg-valex-bronce"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </section>
    )
}

/* Sub-components to keep Hero clean */

function HeroBadge() {
    const { heroBadge } = useSiteConfig()
    return (
        <motion.span 
            variants={heroReveal} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={VALEX_SLOW} 
            className="inline-block text-valex-bronce font-sans font-medium text-xs tracking-[0.25em] uppercase border border-valex-bronce/30 px-4 py-1.5 rounded-full"
        >
            {heroBadge || 'Valex Perfumería'}
        </motion.span>
    )
}

function HeroTitle() {
    const { heroTitle } = useSiteConfig()
    const title = heroTitle || HERO_CONTENT.title
    const words = title.split(' ')
    const main = words.slice(0, 4).join(' ')
    const accent = words.slice(4).join(' ')
    return (
        <motion.div 
            variants={heroReveal} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={VALEX_SLOW} 
            className="flex items-center pt-6 justify-center"
        >
            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-valex-hueso leading-[1.1] tracking-tight">
                {main}{accent ? ' ' : ''}
                {accent && <span className="text-valex-bronce italic">{accent}</span>}
            </h1>
        </motion.div>
    )
}

function HeroSubtitle() {
    const { heroSubtitle } = useSiteConfig()
    return (
        <motion.p 
            variants={heroReveal} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={VALEX_SLOW} 
            className="text-valex-hueso/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light text-center px-2"
        >
            {heroSubtitle || HERO_CONTENT.subtitle}
        </motion.p>
    )
}

function HeroCTA() {
    const { whatsapp } = useSiteConfig()
    return (
        <motion.div 
            variants={heroReveal} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={VALEX_SLOW} 
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
        >
            <Link to="/tienda" className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm px-8 py-3.5 sm:px-10 sm:py-4 rounded-lg bg-valex-bronce text-valex-negro hover:bg-valex-bronce-dark shadow-lg hover:shadow-valex-bronce/30 transition-all duration-300 tracking-wide w-full sm:w-auto">
                Ver Catálogo
            </Link>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-sans font-medium text-sm px-8 py-3.5 sm:px-10 sm:py-4 rounded-lg border border-valex-gris/20 text-valex-gris hover:text-valex-hueso hover:border-valex-gris/40 transition-all duration-300 tracking-wide w-full sm:w-auto">
                <FaWhatsapp className="w-5 h-5" />
                Contactar por WhatsApp
            </a>
        </motion.div>
    )
}

function HeroSocials({ vertical }) {
    const { instagram, tiktok, facebook } = useSiteConfig()
    const socials = [
        { icon: FaInstagram, href: instagram || '#' },
        { icon: FaTiktok, href: tiktok || '#' },
        { icon: FaFacebookF, href: facebook || '#' },
    ]
    return (
        <motion.div 
            variants={fadeInUp} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={VALEX_TRANSITION} 
            className={`flex items-center gap-4 pt-2 ${vertical ? 'flex-col' : ''}`}
        >
            {socials.map((social, i) => {
                const Icon = social.icon
                return (
                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center border border-valex-gris/15 bg-white/5 text-valex-gris/50 hover:text-valex-bronce hover:border-valex-bronce/30 hover:bg-valex-bronce/10 transition-all duration-300 hover:scale-110">
                        <Icon className="w-5 h-5" />
                    </a>
                )
            })}
        </motion.div>
    )
}
