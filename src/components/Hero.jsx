import WhatsAppButton from './WhatsAppButton'
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa'
import heroDesktop from '../img/unnamed (1).jpg'
import heroMobile from '../img/unnamed (1).jpg'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-bg">
            {/* Mobile background image */}
            <div className="absolute inset-0 lg:hidden">
                <img
                    src={heroMobile}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-bg/85" />
            </div>

            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-gold/5 blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle, #C6A96B 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className="space-y-8">
                        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-brand-beige leading-[1.1] tracking-tight">
                            Corte de Autor{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#A38A52]">
                                y Estilo Propio
                            </span>
                        </h1>

                        <p className="text-brand-gray text-lg sm:text-xl leading-relaxed max-w-lg">
                            Donde cada corte cuenta una historia. Experiencia premium, estilo único y atención personalizada para el hombre moderno.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <WhatsAppButton className="text-lg" />
                            <a
                                href="#gallery"
                                className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-2xl border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold/60 transition-all duration-300"
                            >
                                Ver Galería
                            </a>
                        </div>

                        {/* Social media icons */}
                        <div className="flex items-center gap-5 pt-2">
                            {[
                                { icon: FaInstagram, href: '#' },
                                { icon: FaTiktok, href: '#' },
                                { icon: FaFacebookF, href: '#' },
                            ].map((social, i) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 pt-4">
                            {[
                                { value: '500+', label: 'Clientes' },
                                { value: '5★', label: 'Rating' },
                                { value: '3+', label: 'Años' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-brand-gold font-display font-bold text-2xl">{stat.value}</div>
                                    <div className="text-brand-gray text-sm mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Barber image (desktop) */}
                    <div className="relative hidden lg:block">
                        <div className="relative">
                            {/* Decorative glow */}
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 blur-2xl" />

                            {/* Main image */}
                            <div className="relative aspect-[3/4] rounded-3xl border border-brand-dark overflow-hidden shadow-2xl shadow-brand-gold/20">
                                <img
                                    src={heroDesktop}
                                    alt="Barbero profesional"
                                    className="w-full h-full object-cover"
                                />
                                {/* Glass overlay at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
