import { MapPin, Clock, Instagram, Facebook } from 'lucide-react'
import logoImg from '../img/logo/3780b2de-e008-448f-8ee6-cc3cbee70d7a.jpeg'

export default function Footer() {
    return (
        <footer id="contact" className="relative bg-charcoal border-t border-white/5">
            {/* Top gradient line */}
            <div className="h-1 bg-gradient-to-r from-deep-purple via-electric-purple to-deep-purple" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-electric-purple/30 shadow-lg shadow-electric-purple/20">
                                <img src={logoImg} alt="El nica Barber Studio Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white font-display font-bold text-2xl tracking-tight uppercase">
                                EL NICA <span className="text-electric-purple">BS</span>
                            </span>
                        </div>
                        <p className="text-white/40 leading-relaxed">
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
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-electric-purple hover:border-electric-purple/30 hover:bg-electric-purple/10 transition-all duration-300"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white">
                            <Clock className="w-5 h-5 text-electric-purple" />
                            <h3 className="font-display font-bold text-lg">Horario</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { day: 'Lunes - Viernes', hours: '9:00 AM - 7:00 PM' },
                                { day: 'Sábado', hours: '9:00 AM - 5:00 PM' },
                                { day: 'Domingo', hours: 'Cerrado' },
                            ].map((schedule, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-white/50">{schedule.day}</span>
                                    <span className={`font-medium ${schedule.hours === 'Cerrado' ? 'text-red-400/60' : 'text-white/70'}`}>
                                        {schedule.hours}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white">
                            <MapPin className="w-5 h-5 text-electric-purple" />
                            <h3 className="font-display font-bold text-lg">Ubicación</h3>
                        </div>
                        <p className="text-white/50 leading-relaxed">
                            Calle Principal #123<br />
                            Centro, Ciudad<br />
                            CP 12345
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-electric-purple hover:text-electric-purple/70 font-medium text-sm transition-colors duration-300"
                        >
                            <MapPin className="w-4 h-4" />
                            Ver en Google Maps
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-sm">
                        © {new Date().getFullYear()} El nica Barber Studio. Todos los derechos reservados.
                    </p>
                    <p className="text-white/20 text-sm">
                        Hecho con 👑
                    </p>
                </div>
            </div>
        </footer>
    )
}
