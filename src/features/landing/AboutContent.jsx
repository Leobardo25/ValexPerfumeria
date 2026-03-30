import { motion } from 'framer-motion'
import { fadeInUp, VALEX_TRANSITION } from '../../constants/motion'
import useScrollReveal from '../../hooks/useScrollReveal'

const pillars = [
    {
        title: 'Ingredientes Nobles',
        text: 'Seleccionamos las materias primas más finas del mundo: oud de Laos, rosa de Grasse, bergamota de Calabria y sándalo de Mysore. Cada ingrediente es elegido por su pureza y profundidad aromática.',
    },
    {
        title: 'Artesanía Francesa',
        text: 'Nuestras fragancias son formuladas en colaboración con maestros perfumistas de la tradición francesa, herederos de técnicas centenarias que garantizan complejidad y armonía en cada composición.',
    },
    {
        title: 'Experiencia Sensorial',
        text: 'Creemos que un perfume no solo se usa, se vive. Cada frasco de VALEX está diseñado para evocar emociones, despertar recuerdos y proyectar una identidad única e irrepetible.',
    },
]

export default function AboutContent() {
    const { ref, isInView } = useScrollReveal(0.1)

    return (
        <motion.div
            ref={ref}
            className="max-w-4xl mx-auto mb-16"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
            {/* Three pillars */}
            <div className="grid md:grid-cols-3 gap-8">
                {pillars.map((pillar, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        transition={VALEX_TRANSITION}
                        className="text-center space-y-3"
                    >
                        {/* Decorative line */}
                        <div className="w-8 h-[2px] bg-valex-bronce/40 mx-auto" />
                        <h3 className="font-serif font-semibold text-lg text-valex-hueso">
                            {pillar.title}
                        </h3>
                        <p className="text-valex-gris/50 text-sm font-light leading-relaxed">
                            {pillar.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
