import { MapPin, Clock, Mail, Instagram } from 'lucide-react'
import { BRAND, NAV_LINKS } from '../../constants'

export default function Footer() {
    return (
        <footer id="contacto" className="relative bg-valex-negro border-t border-valex-gris/10">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-valex-bronce to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Brand column */}
                    <div className="space-y-5">
                        <span className="font-serif font-bold text-3xl tracking-[0.15em] text-valex-bronce">
                            {BRAND.name}
                        </span>
                        <p className="text-valex-gris/80 leading-relaxed text-sm">
                            {BRAND.description}
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-valex-negro-alt border border-valex-gris/10 flex items-center justify-center text-valex-gris hover:text-valex-bronce hover:border-valex-bronce/30 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-valex-negro-alt border border-valex-gris/10 flex items-center justify-center text-valex-gris hover:text-valex-bronce hover:border-valex-bronce/30 transition-all duration-300"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation column */}
                    <div className="space-y-5">
                        <h3 className="font-serif font-semibold text-lg text-valex-hueso">
                            Navegación
                        </h3>
                        <div className="flex flex-col gap-3">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-valex-gris/70 hover:text-valex-bronce text-sm transition-colors duration-300"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact column */}
                    <div className="space-y-5">
                        <h3 className="font-serif font-semibold text-lg text-valex-hueso">
                            Contacto
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-valex-bronce mt-1 flex-shrink-0" />
                                <div className="text-sm text-valex-gris/70">
                                    <p>Lun – Vie: 10:00 – 19:00</p>
                                    <p>Sáb: 10:00 – 15:00</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-valex-bronce mt-1 flex-shrink-0" />
                                <p className="text-sm text-valex-gris/70">
                                    Av. Principal #123<br />
                                    Centro, Ciudad
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-valex-gris/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-valex-gris/40 text-xs">
                        {BRAND.copyright}
                    </p>
                    <p className="text-valex-gris/30 text-xs">
                        {BRAND.tagline}
                    </p>
                </div>
            </div>
        </footer>
    )
}
