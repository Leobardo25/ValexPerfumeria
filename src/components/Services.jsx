import { Scissors } from 'lucide-react'
import { GiBeard, GiRazor } from 'react-icons/gi'

const services = [
    {
        icon: Scissors,
        title: 'Corte Clásico',
        description: 'Un corte atemporal con técnicas profesionales. Incluye lavado, corte y styling personalizado.',
    },
    {
        icon: GiBeard,
        title: 'Arreglo de Barba',
        description: 'Perfilado y arreglo de barba con navaja y productos premium. Tu barba, perfecta.',
    },
    {
        icon: GiRazor,
        title: 'Afeitado Premium',
        description: 'Afeitado clásico con toalla caliente, navaja de barbero y bálsamo hidratante.',
    },
]

export default function Services() {
    return (
        <section id="services" className="relative py-24 sm:py-32 bg-lavender-soft">
            {/* Subtle bg accent */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-electric-purple/5 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block text-electric-purple font-semibold text-sm tracking-widest uppercase mb-4">
                        Nuestros Servicios
                    </span>
                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-charcoal">
                        Experiencia{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-purple to-electric-purple">
                            Premium
                        </span>
                    </h2>
                </div>

                {/* Cards grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, i) => {
                        const Icon = service.icon
                        return (
                            <div
                                key={i}
                                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-deep-purple/10 border border-gray-100 hover:border-electric-purple/20 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-deep-purple to-electric-purple flex items-center justify-center mb-6 shadow-lg shadow-electric-purple/20 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="font-display font-bold text-xl text-charcoal mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
