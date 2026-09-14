import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { PRODUCTS } from '../data/products'
import { formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

const SUGGESTIONS = ['Overcoat', 'Merino', 'Sneaker', 'Denim', 'Tote']

export default function SearchModal() {
  const { ui, setPanel, openQuickView, currency } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const open = ui.search

  useEffect(() => {
    if (open) {
      setQuery('')
      // Wait for the panel transition before stealing focus.
      const timer = setTimeout(() => inputRef.current?.focus(), 180)
      return () => clearTimeout(timer)
    }
  }, [open])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return PRODUCTS.filter((product) =>
      [product.name, product.category, product.description, ...product.colors.map((c) => c.name)]
        .join(' ')
        .toLowerCase()
        .includes(term),
    ).slice(0, 6)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Close search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setPanel('search', false)}
            className="absolute inset-0 w-full cursor-default bg-obsidian/40 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-h-[88vh] w-full max-w-3xl overflow-y-auto bg-cream shadow-2xl scrollbar-slim sm:mt-24 sm:rounded-sm"
          >
            <div className="flex items-center gap-4 border-b border-line px-5 py-5 sm:px-8">
              <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.4} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the collection"
                className="w-full bg-transparent font-display text-lg tracking-tight outline-none placeholder:text-muted sm:text-xl"
              />
              <button
                type="button"
                onClick={() => setPanel('search', false)}
                aria-label="Close search"
                className="shrink-0 text-muted transition-colors hover:text-obsidian"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8">
              {!query.trim() ? (
                <>
                  <p className="eyebrow text-muted">Popular searches</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="border border-line px-4 py-2 font-display text-[11px] uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-obsidian hover:bg-obsidian hover:text-cream"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              ) : results.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">
                  No pieces match “{query}”. Try a colour, a category, or a fabric.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPanel('search', false)
                          openQuickView(product.id)
                        }}
                        className="group flex w-full items-center gap-4 py-3 text-left"
                      >
                        <SmartImage
                          id={product.images[0]}
                          alt={product.name}
                          label={product.name}
                          width={160}
                          sizes="64px"
                          wrapperClassName="h-20 w-16 shrink-0"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-sm font-medium tracking-tight">
                            {product.name}
                          </span>
                          <span className="eyebrow mt-1 block text-[10px] text-muted">
                            {product.category}
                          </span>
                        </span>
                        <span className="shrink-0 font-display text-sm tabular-nums">
                          {formatPrice(product.price, currency)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
