import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { LOOKS } from '../data/lookbook'
import { PRODUCT_MAP } from '../data/products'
import { useStore } from '../store/StoreContext'
import { cn, formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

const SPANS = {
  tall: 'lg:col-span-5 lg:row-span-2',
  wide: 'lg:col-span-7',
  standard: 'lg:col-span-3',
}

/** A single "shop the look" pin and the card it reveals. */
function Hotspot({ hotspot, lookTitle }) {
  const [open, setOpen] = useState(false)
  const { openQuickView, addToCart, currency } = useStore()
  const product = PRODUCT_MAP[hotspot.productId]

  if (!product) return null

  // Flip the card to the left edge when the pin sits on the right of the frame.
  const flipX = hotspot.x > 58
  const flipY = hotspot.y > 62

  return (
    <div
      className="absolute z-10"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Shop ${product.name} from ${lookTitle}`}
        className="relative flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-obsidian shadow-lg transition-transform duration-300 hover:scale-110"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-cream/60 [animation-duration:2.4s]" />
        )}
        <span className="relative">
          {open ? <X className="h-3.5 w-3.5" strokeWidth={2} /> : <Plus className="h-4 w-4" strokeWidth={2} />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute w-60 bg-cream p-3 shadow-2xl',
              flipX ? 'right-4' : 'left-4',
              flipY ? 'bottom-4' : 'top-4',
            )}
          >
            <div className="flex gap-3">
              <SmartImage
                id={product.images[0]}
                alt={product.name}
                label={product.name}
                width={160}
                sizes="64px"
                wrapperClassName="h-20 w-16 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-[9px] text-muted">{product.category}</p>
                <h4 className="mt-1 truncate font-display text-sm font-medium tracking-tight">
                  {product.name}
                </h4>
                <p className="mt-1 font-display text-sm tabular-nums">
                  {formatPrice(product.price, currency)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openQuickView(product.id)
                }}
                className="flex-1 border border-line py-2 font-display text-[10px] font-medium uppercase tracking-[0.14em] transition-colors hover:border-obsidian"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(product)
                  setOpen(false)
                }}
                className="flex-1 bg-obsidian py-2 font-display text-[10px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-charcoal"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Lookbook() {
  return (
    <section id="lookbook" className="bg-haze">
      {/* Brand story */}
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">The Lookbook</p>
            <h2 className="display mt-3 text-[clamp(2.25rem,6vw,4.5rem)]">
              Volume 04
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="font-editorial text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] tracking-[-0.01em] text-obsidian">
              “We design for the eleventh wear, not the first. A coat should look
              better the season after you bought it.”
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal">
              Shot over three days in Antwerp, Volume 04 gathers the pieces we return
              to when the weather turns — long wool, dry cotton, and leather that
              takes a mark and keeps it. Tap any pin to shop the look.
            </p>
          </div>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {LOOKS.map((look, index) => (
            <motion.figure
              key={look.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group relative overflow-hidden bg-cream',
                SPANS[look.span] ?? SPANS.standard,
                look.span === 'tall' ? 'aspect-3/4 lg:aspect-auto' : 'aspect-4/5 lg:aspect-3/2',
                look.span === 'wide' && index === LOOKS.length - 1 && 'sm:col-span-2 lg:col-span-12 lg:aspect-[21/9]',
              )}
            >
              <SmartImage
                id={look.image}
                alt={`${look.title} — ${look.caption}`}
                label={look.title}
                ratio="4 / 5"
                width={1400}
                sizes="(min-width: 1024px) 50vw, 100vw"
                fallbackText={false}
                wrapperClassName="absolute inset-0 h-full w-full"
                className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />

              {/* Scrim keeps the caption legible over any photograph. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/65 via-transparent to-transparent" />

              {look.hotspots.map((hotspot) => (
                <Hotspot key={hotspot.id} hotspot={hotspot} lookTitle={look.title} />
              ))}

              <figcaption className="pointer-events-none absolute bottom-0 left-0 p-5 sm:p-6">
                <p className="eyebrow text-[10px] text-cream/70">{look.caption}</p>
                <p className="display mt-1.5 text-2xl text-cream sm:text-3xl">{look.title}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
