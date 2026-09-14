import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Leaf, RotateCcw, Truck } from 'lucide-react'
import Button from './Button'
import SmartImage from './SmartImage'

const TRUST = [
  { icon: Leaf, title: 'Sustainable Sourcing', copy: 'Traceable fibres, audited mills' },
  { icon: Truck, title: 'Express Shipping', copy: 'Worldwide in 2–4 working days' },
  { icon: RotateCcw, title: 'Easy Returns', copy: '30 days, collection included' },
]

const rise = {
  hidden: { opacity: 0, y: 34 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  // A slow drift on the backdrop gives the hero depth without hijacking scroll.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0])

  return (
    <section id="top" className="bg-cream">
      <div ref={sectionRef} className="relative h-[92svh] min-h-[600px] w-full overflow-hidden">
        <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
          <SmartImage
            id="photo-1490481651871-ab68de25d43d"
            alt="Model wearing the Autumn Volume 04 collection"
            label="Autumn Volume 04"
            ratio="16 / 9"
            width={2000}
            sizes="100vw"
            priority
            fallbackText={false}
            wrapperClassName="h-full w-full bg-obsidian"
            className="object-center"
          />
        </motion.div>

        {/* Scrim: heavier at the foot so the type always clears the photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/35 to-obsidian/25" />

        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24"
        >
          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="eyebrow text-cream/70"
          >
            Volume 04 — Autumn / Winter
          </motion.p>

          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.22}
            className="display mt-5 max-w-5xl text-[clamp(2.75rem,11vw,9rem)] text-cream"
          >
            Dressed for
            <br />
            <span className="font-editorial font-normal italic tracking-[-0.01em]">the long</span> season
          </motion.h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.34}
            className="mt-7 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg"
          >
            Considered outerwear and everyday essentials, made in small runs from
            traceable fibres — built to outlast the season that named them.
          </motion.p>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.46}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button as="a" href="#catalogue" variant="light" size="lg" className="group">
              Shop New Drop
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.6}
              />
            </Button>
            <Button
              as="a"
              href="#lookbook"
              size="lg"
              className="border border-cream/40 bg-transparent text-cream backdrop-blur-sm hover:border-cream hover:bg-cream hover:text-obsidian"
            >
              Explore Lookbook
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust strip */}
      <div className="border-b border-line">
        <ul className="mx-auto grid max-w-[1600px] grid-cols-1 divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
          {TRUST.map(({ icon: Icon, title, copy }, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 py-6 md:justify-center md:px-6"
            >
              <Icon className="h-5 w-5 shrink-0 text-charcoal" strokeWidth={1.3} />
              <div>
                <p className="eyebrow text-[10px] text-obsidian">{title}</p>
                <p className="mt-1 text-xs text-muted">{copy}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
