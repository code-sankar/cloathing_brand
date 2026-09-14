import { motion } from 'framer-motion'

const WORDS = ['Small Runs', 'Traceable Fibres', 'Made to Outlast', 'Repaired, Not Replaced']

/**
 * A scrolling brand statement that breaks up the page between the catalogue
 * and the lookbook.
 */
export default function Marquee() {
  return (
    <section aria-label="Brand principles" className="overflow-hidden border-y border-line bg-cream py-6">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {WORDS.map((word) => (
              <span key={word} className="flex items-center">
                <span className="display px-8 text-[clamp(1.75rem,4.5vw,3.5rem)] text-obsidian/85">
                  {word}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-obsidian/30" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
