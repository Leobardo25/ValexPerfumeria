import { motion } from 'framer-motion'
import { MOODBOARD_IMAGES, BRAND } from '../../constants'
import { fadeInUp, VALEX_TRANSITION } from '../../constants/motion'
import useScrollReveal from '../../hooks/useScrollReveal'
import AboutContent from './AboutContent'
import moodIngredients from '../../img/perfumeria/mood-ingredients.png'
import moodCrystal from '../../img/perfumeria/mood-crystal.png'
import moodScene from '../../img/perfumeria/mood-scene.png'
import heroImg from '../../img/perfumeria/hero.png'
import oudImg from '../../img/perfumeria/oud-mystique.png'
import roseImg from '../../img/perfumeria/velvet-rose.png'

const moodImages = {
    'mood-ingredients': moodIngredients,
    'mood-crystal': moodCrystal,
    'mood-scene': moodScene,
}

const extraImages = [
    { src: heroImg, alt: 'Perfume sobre seda negra' },
    { src: oudImg, alt: 'Esencia de oud y ámbar' },
    { src: roseImg, alt: 'Pétalos de rosa y cristal' },
]

const allImages = [
    ...MOODBOARD_IMAGES.map((img) => ({ src: moodImages[img.id], alt: img.alt })),
    ...extraImages,
]

export default function Moodboard() {
    const { ref: headerRef, isInView: headerInView } = useScrollReveal(0.3)
    const { ref: gridRef, isInView: gridInView } = useScrollReveal(0.1)

    return (
        <section id="nosotros" className="relative py-24 sm:py-32 bg-valex-negro overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-valex-bronce/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-valex-bronce/3 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header — scroll reveal */}
                <motion.div
                    ref={headerRef}
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 25 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={VALEX_TRANSITION}
                >
                    <span className="inline-block text-valex-bronce font-sans font-medium text-xs tracking-[0.25em] uppercase mb-4">
                        Nuestro Universo
                    </span>
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl text-valex-hueso">
                        El Lujo está en{' '}
                        <span className="text-valex-bronce italic">los Detalles</span>
                    </h2>
                    <p className="text-valex-gris/60 mt-4 text-base font-light max-w-lg mx-auto">
                        {BRAND.description}
                    </p>
                </motion.div>

                {/* About content — expanded info */}
                <AboutContent />

                {/* Grid — staggered fade-in */}
                <motion.div
                    ref={gridRef}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5"
                    initial="hidden"
                    animate={gridInView ? 'visible' : 'hidden'}
                    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                >
                    {allImages.map((image, i) => (
                        <MoodCard key={i} src={image.src} alt={image.alt} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

function MoodCard({ src, alt }) {
    return (
        <motion.div
            variants={fadeInUp}
            transition={VALEX_TRANSITION}
            className="group aspect-[3/4] rounded-xl overflow-hidden border border-valex-gris/10 shadow-lg cursor-pointer"
        >
            <div className="w-full h-full relative overflow-hidden">
                <motion.img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className="absolute inset-0 bg-valex-negro/0 group-hover:bg-valex-negro/20 transition-colors duration-700" />
            </div>
        </motion.div>
    )
}
