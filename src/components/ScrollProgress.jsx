import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * A hairline read-out of how far down the page you are, pinned to the bottom
 * edge of the sticky header. Spring-smoothed so it glides instead of jittering
 * with every scroll event.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-obsidian"
    />
  )
}
