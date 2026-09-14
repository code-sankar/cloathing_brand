import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Grid2x2, LayoutGrid } from 'lucide-react'
import { CATEGORIES, PRODUCTS, SORT_OPTIONS } from '../data/products'
import { cn } from '../lib/utils'
import ProductCard from './ProductCard'

/** Accessible dropdown that closes on outside click and Escape. */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const active = SORT_OPTIONS.find((option) => option.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-2 border border-line px-4 font-display text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-obsidian"
      >
        <span className="text-muted">Sort</span>
        <span>{active?.label}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={1.6}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-30 mt-2 w-60 border border-line bg-cream shadow-xl"
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-display text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-haze"
                >
                  {option.label}
                  {option.value === value && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductGrid() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [dense, setDense] = useState(false) // false = 3 cols, true = 4 cols on desktop

  const visible = useMemo(() => {
    const filtered =
      category === 'All' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === category)

    switch (sort) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price)
      case 'newest':
        return filtered.sort((a, b) => new Date(b.releasedOn) - new Date(a.releasedOn))
      default:
        return filtered.sort((a, b) => a.rank - b.rank)
    }
  }, [category, sort])

  return (
    <section id="catalogue" className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-muted">The Collection</p>
          <h2 className="display mt-3 text-[clamp(2.25rem,6vw,4.5rem)]">Autumn, in full</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal lg:text-right">
          Eighteen pieces, cut from traceable fibres and made in runs small enough to
          check by hand.
        </p>
      </div>

      {/* Controls */}
      <div className="sticky top-[104px] z-30 -mx-4 mt-6 bg-cream/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category pills */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {CATEGORIES.map((item) => {
              const active = item === category
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={active}
                  className={cn(
                    'relative shrink-0 rounded-full border px-5 py-2.5 font-display text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300',
                    active
                      ? 'border-obsidian text-cream'
                      : 'border-line text-charcoal hover:border-obsidian',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="category-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-obsidian"
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-xs text-muted tabular-nums lg:hidden">{visible.length} pieces</p>

            <div className="flex items-center gap-3">
              <p className="hidden text-xs text-muted tabular-nums lg:block">
                {visible.length} pieces
              </p>

              {/* Density toggle — hidden on mobile, which is always 2-up. */}
              <div className="hidden items-center border border-line lg:flex">
                <button
                  type="button"
                  onClick={() => setDense(false)}
                  aria-label="Three column grid"
                  aria-pressed={!dense}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center transition-colors',
                    !dense ? 'bg-obsidian text-cream' : 'text-charcoal hover:bg-haze',
                  )}
                >
                  <Grid2x2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setDense(true)}
                  aria-label="Four column grid"
                  aria-pressed={dense}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center transition-colors',
                    dense ? 'bg-obsidian text-cream' : 'text-charcoal hover:bg-haze',
                  )}
                >
                  <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className={cn(
          'mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6',
          dense ? 'lg:grid-cols-4' : 'md:grid-cols-3',
        )}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} compact={dense} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="py-24 text-center text-sm text-muted">
          Nothing in this category yet — check back after the next drop.
        </p>
      )}
    </section>
  )
}
