import { Check } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'

const prices = [
    { name: 'Corte', price: '₡5,000', features: ['Lavado incluido', 'Estilizado', 'Consulta personalizada'] },
    { name: 'Barba', price: '₡3,000', features: ['Perfilado con navaja', 'Productos premium', 'Toalla caliente'] },
    { name: 'Combo', price: '₡7,000', features: ['Corte + Barba', 'Ahorra ₡1,000', 'Experiencia completa'], featured: true },
]

export default function Pricing() {
    return (
        <section id="prices" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 bg-charcoal overflow-hidden">
            {/* Bg accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-deep-purple/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block text-electric-purple font-semibold text-sm tracking-widest uppercase mb-4">
                        Precios
                    </span>
                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
                        Tarifas{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-purple to-electric-purple">
                            Transparentes
                        </span>
                    </h2>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {prices.map((item, i) => (
                        <div
                            key={i}
                            className={`relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${item.featured
                                ? 'bg-gradient-to-br from-deep-purple to-electric-purple text-white shadow-2xl shadow-electric-purple/30 scale-105'
                                : 'bg-white/5 border border-white/10 text-white hover:border-electric-purple/30'
                                }`}
                        >
                            {item.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-deep-purple text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                    POPULAR
                                </div>
                            )}

                            <h3 className="font-display font-bold text-xl mb-2">{item.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="font-display font-extrabold text-4xl">{item.price}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {item.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.featured ? 'bg-white/20' : 'bg-electric-purple/20'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className={item.featured ? 'text-white/90' : 'text-white/60'}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="https://wa.me/yournumber"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block text-center font-semibold py-3 rounded-xl transition-all duration-300 ${item.featured
                                    ? 'bg-white text-deep-purple hover:bg-white/90 shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                Reservar
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    )
}
