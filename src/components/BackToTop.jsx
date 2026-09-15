import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * Appears once the hero is well out of view, and steps aside when the footer
 * arrives — a fixed button sitting on top of the newsletter copy reads as an
 * accident. The footer carries its own inline "back to top" link instead.
 */
export default function BackToTop() {
  const [scrolled, setScrolled] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 1.2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.01 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {scrolled && !footerVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 left-4 z-40 flex h-11 w-11 items-center justify-center border border-line bg-cream/90 text-obsidian shadow-lg backdrop-blur-md transition-colors hover:border-obsidian hover:bg-obsidian hover:text-cream sm:bottom-6 sm:left-6"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.6} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
