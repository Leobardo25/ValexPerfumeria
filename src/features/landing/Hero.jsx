import { useRef } from 'react'
import { motion } from 'framer-motion'
import { HERO_CONTENT, HERO_STATS } from '../../constants'
import { heroReveal, fadeInUp, VALEX_SLOW, VALEX_TRANSITION } from '../../constants/motion'
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa'
import useParallax from '../../hooks/useParallax'
import heroImg from '../../img/perfumeria/hero.png'

export default function Hero() {
    const sectionRef = useRef(null)
    const parallaxY = useParallax(sectionRef, 0.1)

    return (
        <section ref={sectionRef} id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-valex-negro">
            {/* Background image — mobile */}
            <div className="absolute inset-0 lg:hidden">
                <img src={heroImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-valex-negro/85" />
            </div>

            {/* Subtle orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-valex-bronce/8 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-valex-bronce/5 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle, #A68966 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left content — staggered reveal */}
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
                    >
                        <HeroBadge />
                        <HeroTitle />
                        <HeroSubtitle />
                        <HeroCTA />
                        <HeroSocials />
                        <HeroStats />
                    </motion.div>

                    {/* Right side — Parallax image */}
                    <motion.div
                        className="relative hidden lg:block"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...VALEX_SLOW, delay: 0.4 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-6 rounded-2xl bg-gradient-to-br from-valex-bronce/15 to-valex-bronce/5 blur-2xl" />
                            <div className="relative aspect-[3/4] rounded-2xl border border-valex-gris/10 overflow-hidden shadow-2xl">
                                <motion.img
                                    src={heroImg}
                                    alt="Frasco de perfume de lujo VALEX"
                                    className="w-full h-full object-cover"
                                    style={{ y: parallaxY }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-valex-negro to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

/* Sub-components to keep Hero under 150 lines */

function HeroBadge() {
    return (
        <motion.span variants={heroReveal} transition={VALEX_SLOW} className="inline-block text-valex-bronce font-sans font-medium text-xs tracking-[0.25em] uppercase border border-valex-bronce/30 px-4 py-1.5 rounded-full">
            Perfumería de Autor
        </motion.span>
    )
}

function HeroTitle() {
    return (
        <motion.h1 variants={heroReveal} transition={VALEX_SLOW} className="font-serif font-bold text-5xl sm:text-6xl lg:text-7xl text-valex-hueso leading-[1.1] tracking-tight">
            {HERO_CONTENT.title.split(' ').slice(0, 4).join(' ')}{' '}
            <span className="text-valex-bronce italic">
                {HERO_CONTENT.title.split(' ').slice(4).join(' ')}
            </span>
        </motion.h1>
    )
}

function HeroSubtitle() {
    return (
        <motion.p variants={heroReveal} transition={VALEX_SLOW} className="text-valex-gris text-lg sm:text-xl leading-relaxed max-w-lg font-light">
            {HERO_CONTENT.subtitle}
        </motion.p>
    )
}

function HeroCTA() {
    return (
        <motion.div variants={fadeInUp} transition={VALEX_TRANSITION} className="flex flex-col sm:flex-row gap-4">
            <a href={HERO_CONTENT.ctaHref} className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm px-10 py-4 rounded-lg bg-valex-bronce text-valex-negro hover:bg-valex-bronce-dark shadow-lg hover:shadow-valex-bronce/30 transition-all duration-300 tracking-wide">
                {HERO_CONTENT.cta}
            </a>
            <a href="https://wa.me/xxxxxxxxxx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-sans font-medium text-sm px-10 py-4 rounded-lg border border-valex-gris/20 text-valex-gris hover:text-valex-hueso hover:border-valex-gris/40 transition-all duration-300 tracking-wide">
                <FaWhatsapp className="w-5 h-5" />
                Contactar por WhatsApp
            </a>
        </motion.div>
    )
}

function HeroSocials() {
    const socials = [
        { icon: FaInstagram, href: '#' },
        { icon: FaTiktok, href: '#' },
        { icon: FaFacebookF, href: '#' },
    ]
    return (
        <motion.div variants={fadeInUp} transition={VALEX_TRANSITION} className="flex items-center gap-4 pt-2">
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

function HeroStats() {
    return (
        <motion.div variants={fadeInUp} transition={VALEX_TRANSITION} className="flex gap-10 pt-6">
            {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                    <div className="text-valex-bronce font-serif font-bold text-2xl">{stat.value}</div>
                    <div className="text-valex-gris/60 text-xs font-sans mt-1 tracking-wide uppercase">{stat.label}</div>
                </div>
            ))}
        </motion.div>
    )
}
