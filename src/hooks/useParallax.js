import { useScroll, useTransform } from 'framer-motion'

/**
 * Custom hook for parallax scrolling effect.
 * Attaches to a container ref and returns a motion value
 * that moves slower than scroll (creates depth illusion).
 *
 * @param {React.RefObject} ref - Container element ref
 * @param {number} speed - Parallax intensity (default 0.1 = 10% slower)
 * @returns {import('framer-motion').MotionValue} y motion value
 */
export default function useParallax(ref, speed = 0.1) {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

    return y
}
