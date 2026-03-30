import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Custom hook for scroll-triggered reveal animations.
 * Returns a ref to attach to the element + whether it's in view.
 * Once triggered, stays visible (once: true).
 *
 * @param {number} amount - Percentage of element visible to trigger (0-1)
 * @param {string} margin - Root margin offset
 * @returns {{ ref: React.RefObject, isInView: boolean }}
 */
export default function useScrollReveal(amount = 0.05, margin = '0px') {
    const ref = useRef(null)
    const isInView = useInView(ref, {
        once: true,
        amount,
        margin,
    })

    return { ref, isInView }
}

