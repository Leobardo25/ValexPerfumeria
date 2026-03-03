import img1 from '../img/Galeria1/unnamed.jpg'
import img2 from '../img/Galeria1/unnamed (1).jpg'
import img3 from '../img/Galeria1/unnamed (2).jpg'
import img4 from '../img/Galeria1/unnamed (3).jpg'
import img5 from '../img/Galeria1/unnamed (4).jpg'
import img6 from '../img/Galeria1/unnamed (6).jpg'

const galleryImages = [img1, img2, img3, img4, img5, img6]

export default function Gallery() {
    return (
        <section id="gallery" className="relative py-24 sm:py-32 bg-lavender-soft">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block text-electric-purple font-semibold text-sm tracking-widest uppercase mb-4">
                        Galería
                    </span>
                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-charcoal">
                        Nuestro{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-purple to-electric-purple">
                            Trabajo
                        </span>
                    </h2>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {galleryImages.map((src, i) => (
                        <div
                            key={i}
                            className="group aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-deep-purple/10 transition-all duration-500 hover:scale-[1.03] cursor-pointer"
                        >
                            <div className="w-full h-full relative">
                                <img
                                    src={src}
                                    alt={`Trabajo ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
