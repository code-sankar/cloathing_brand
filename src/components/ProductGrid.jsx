import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Grid2x2, LayoutGrid, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, PRODUCTS, SORT_OPTIONS } from '../data/products'
import { useStore } from '../store/StoreContext'
import { cn, formatPrice } from '../lib/utils'
import ProductCard from './ProductCard'

/* Facets derived once from the catalogue rather than hand-maintained. */
const ALL_SIZES = [...new Set(PRODUCTS.flatMap((p) => p.sizes))]
const ALL_COLORS = [
  ...new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
].sort((a, b) => a.name.localeCompare(b.name))
const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.price))
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price))

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
        <span className="hidden text-muted sm:inline">Sort</span>
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

/** A removable summary of one active facet. */
function FilterChip({ label, onRemove }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onRemove}
      className="group flex shrink-0 items-center gap-1.5 rounded-full bg-obsidian px-3 py-1.5 font-display text-[10px] font-medium uppercase tracking-[0.14em] text-cream"
    >
      {label}
      <X className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" strokeWidth={2.2} />
    </motion.button>
  )
}

export default function ProductGrid() {
  const { currency } = useStore()

  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [dense, setDense] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)

  const toggle = (setter) => (value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  const clearAll = () => {
    setSizes([])
    setColors([])
    setMaxPrice(PRICE_MAX)
    setCategory('All')
  }

  const priceFiltered = maxPrice < PRICE_MAX
  const activeCount = sizes.length + colors.length + (priceFiltered ? 1 : 0)

  const visible = useMemo(() => {
    let list = category === 'All' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === category)

    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)))
    if (priceFiltered) list = list.filter((p) => p.price <= maxPrice)

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'newest':
        return list.sort((a, b) => new Date(b.releasedOn) - new Date(a.releasedOn))
      default:
        return list.sort((a, b) => a.rank - b.rank)
    }
  }, [category, sort, sizes, colors, maxPrice, priceFiltered])

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

              <button
                type="button"
                onClick={() => setPanelOpen((prev) => !prev)}
                aria-expanded={panelOpen}
                aria-controls="filter-panel"
                className={cn(
                  'flex h-10 items-center gap-2 border px-4 font-display text-[11px] font-medium uppercase tracking-[0.16em] transition-colors',
                  activeCount > 0
                    ? 'border-obsidian bg-obsidian text-cream'
                    : 'border-line hover:border-obsidian',
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} />
                Filters
                {activeCount > 0 && <span className="tabular-nums">({activeCount})</span>}
              </button>

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

        {/* Active facets */}
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pt-3">
                <AnimatePresence initial={false}>
                  {sizes.map((size) => (
                    <FilterChip key={'s' + size} label={`Size ${size}`} onRemove={() => toggle(setSizes)(size)} />
                  ))}
                  {colors.map((color) => (
                    <FilterChip key={'c' + color} label={color} onRemove={() => toggle(setColors)(color)} />
                  ))}
                  {priceFiltered && (
                    <FilterChip
                      key="price"
                      label={`Under ${formatPrice(maxPrice, currency)}`}
                      onRemove={() => setMaxPrice(PRICE_MAX)}
                    />
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={clearAll}
                  className="link-underline shrink-0 pl-1 font-display text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-obsidian"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              id="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-8 border-t border-line pt-6 md:grid-cols-3">
                <div>
                  <p className="eyebrow text-[10px] text-muted">Size</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ALL_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggle(setSizes)(size)}
                        aria-pressed={sizes.includes(size)}
                        className={cn(
                          'min-w-11 border px-2.5 py-2 font-display text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                          sizes.includes(size)
                            ? 'border-obsidian bg-obsidian text-cream'
                            : 'border-line text-charcoal hover:border-obsidian',
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-[10px] text-muted">Colour</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ALL_COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => toggle(setColors)(color.name)}
                        aria-pressed={colors.includes(color.name)}
                        title={color.name}
                        aria-label={color.name}
                        className={cn(
                          'h-7 w-7 rounded-full border transition-all duration-200',
                          colors.includes(color.name)
                            ? 'border-obsidian ring-1 ring-obsidian ring-offset-2 ring-offset-cream'
                            : 'border-line hover:border-muted',
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="max-price" className="eyebrow text-[10px] text-muted">
                    Max price —{' '}
                    <span className="text-obsidian tabular-nums">
                      {formatPrice(maxPrice, currency)}
                    </span>
                  </label>
                  <input
                    id="max-price"
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={5}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(Number(event.target.value))}
                    className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-obsidian"
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-muted tabular-nums">
                    <span>{formatPrice(PRICE_MIN, currency)}</span>
                    <span>{formatPrice(PRICE_MAX, currency)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <div className="py-24 text-center">
          <p className="text-sm text-muted">Nothing matches those filters yet.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 border border-obsidian px-6 py-3 font-display text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-obsidian hover:text-cream"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
