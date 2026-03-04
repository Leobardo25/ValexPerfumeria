import { MapPin, Clock, Instagram, Facebook } from 'lucide-react'
import logoImg from '../img/logo/112d65eb-8d59-4da8-be33-a35c202589e3.jpeg'

export default function Footer() {
    return (
        <footer id="contact" className="relative bg-brand-bg border-t border-brand-dark">
            {/* Top gradient line */}
            <div className="h-1 bg-brand-gold" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold/30 shadow-lg shadow-brand-gold/20">
                                <img src={logoImg} alt="Reckless Studio Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-brand-beige font-display font-bold text-2xl tracking-tight uppercase">
                                RECKLESS <span className="text-brand-gold">STUDIO</span>
                            </span>
                        </div>
                        <p className="text-brand-gray leading-relaxed">
                            Donde cada corte cuenta una historia. Barbería premium para el hombre moderno.
                        </p>

                        {/* Socials */}
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: Instagram, href: '#' },
                                { icon: Facebook, href: '#' },
                            ].map((social, i) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
                                        className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-dark flex items-center justify-center text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-beige">
                            <Clock className="w-5 h-5 text-brand-gold" />
                            <h3 className="font-display font-bold text-lg">Horario</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { day: 'Lunes - Viernes', hours: '9:00 AM - 7:00 PM' },
                                { day: 'Sábado', hours: '9:00 AM - 5:00 PM' },
                                { day: 'Domingo', hours: 'Cerrado' },
                            ].map((schedule, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-brand-gray">{schedule.day}</span>
                                    <span className={`font-medium ${schedule.hours === 'Cerrado' ? 'text-red-400/60' : 'text-brand-white'}`}>
                                        {schedule.hours}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-beige">
                            <MapPin className="w-5 h-5 text-brand-gold" />
                            <h3 className="font-display font-bold text-lg">Ubicación</h3>
                        </div>
                        <p className="text-brand-gray leading-relaxed">
                            Calle Principal #123<br />
                            Centro, Ciudad<br />
                            CP 12345
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-brand-gold hover:text-[#A38A52] font-medium text-sm transition-colors duration-300"
                        >
                            <MapPin className="w-4 h-4" />
                            Ver en Google Maps
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-brand-gray text-sm">
                        © {new Date().getFullYear()} Reckless Studio. Todos los derechos reservados.
                    </p>
                    <p className="text-brand-gray/50 text-sm">
                        Hecho con 👑
                    </p>
                </div>
            </div>
        </footer>
    )
}
