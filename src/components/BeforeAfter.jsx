import { useState, useRef, useCallback } from 'react'
import beforeImg from '../img/galeriaAD/unnamed.jpg'
import afterImg from '../img/galeriaAD/unnamed (1).jpg'

export default function BeforeAfter() {
    const [sliderPos, setSliderPos] = useState(50)
    const containerRef = useRef(null)
    const isDragging = useRef(false)
    const rafRef = useRef(null)

    const updatePosition = useCallback((clientX) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const percent = (x / rect.width) * 100

        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
            setSliderPos(percent)
        })
    }, [])

    const handleMouseDown = () => { isDragging.current = true }
    const handleMouseUp = () => { isDragging.current = false }
    const handleMouseMove = (e) => {
        if (!isDragging.current) return
        e.preventDefault()
        updatePosition(e.clientX)
    }

    const handleTouchMove = (e) => {
        // Prevent default only if we are taking over the touch action
        // Actually touch-action: none on the container is better for CSS
        updatePosition(e.touches[0].clientX)
    }

    return (
        <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 bg-brand-bg overflow-hidden">
            {/* Bg accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-gold/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="inline-block text-brand-gold font-semibold text-sm tracking-widest uppercase mb-4">
                        Resultados
                    </span>
                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-brand-beige">
                        Antes{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#A38A52]">
                            & Después
                        </span>
                    </h2>
                    <p className="text-brand-gray/80 mt-4 text-lg">
                        Desliza para ver la transformación
                    </p>
                </div>

                {/* Slider */}
                <div className="max-w-2xl mx-auto">
                    <div
                        ref={containerRef}
                        className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-brand-dark shadow-2xl shadow-brand-gold/10 cursor-col-resize select-none touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {/* After image (full background) */}
                        <img
                            src={afterImg}
                            alt="Después"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                        />

                        {/* Before image (clipped by slider position) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderPos}%` }}
                        >
                            <img
                                src={beforeImg}
                                alt="Antes"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ width: `${containerRef.current ? containerRef.current.offsetWidth : 100}px`, maxWidth: 'none' }}
                                draggable={false}
                            />
                        </div>

                        {/* Slider line */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-brand-gold shadow-lg shadow-brand-gold/30 z-10"
                            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                        >
                            {/* Slider handle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-gold shadow-xl shadow-brand-gold/40 flex items-center justify-center gap-0.5">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-brand-bg" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                                    <svg className="w-3 h-3 text-brand-bg" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-sm text-brand-beige text-xs font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider">
                            Antes
                        </div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-gold to-[#A38A52] text-brand-bg text-xs font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wider">
                            Después
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
