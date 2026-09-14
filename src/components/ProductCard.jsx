import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { cn, formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

export default function ProductCard({ product, compact = false }) {
  const { addToCart, toggleWishlist, wishlist, openQuickView, currency } = useStore()
  const [hovered, setHovered] = useState(false)
  const [sizePickerOpen, setSizePickerOpen] = useState(false)
  const [activeColor, setActiveColor] = useState(0)

  const saved = wishlist.includes(product.id)
  const singleSize = product.sizes.length === 1

  const resetHover = () => {
    setHovered(false)
    setSizePickerOpen(false)
  }

  const quickAdd = (size) => {
    addToCart(product, { size, color: product.colors[activeColor].name })
    setSizePickerOpen(false)
  }

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetHover}
    >
      <div className="relative overflow-hidden bg-haze">
        {/* Primary / secondary imagery. The alternate look cross-fades in. */}
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          aria-label={`View ${product.name}`}
          className="block w-full"
        >
          <span className="relative block aspect-3/4 w-full">
            <SmartImage
              id={product.images[0]}
              alt={product.name}
              label={product.name}
              wrapperClassName="absolute inset-0 h-full w-full"
              className={cn(
                'transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                hovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100',
              )}
            />
            <SmartImage
              id={product.images[1] ?? product.images[0]}
              alt={`${product.name}, alternate view`}
              label={product.name}
              wrapperClassName="absolute inset-0 h-full w-full"
              className={cn(
                'transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                hovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0',
              )}
            />
          </span>
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-obsidian px-2.5 py-1 font-display text-[9px] font-medium uppercase tracking-[0.18em] text-cream">
            {product.badge}
          </span>
        )}

        {product.compareAt && (
          <span className="pointer-events-none absolute right-3 top-3 bg-cream px-2.5 py-1 font-display text-[9px] font-medium uppercase tracking-[0.18em] text-obsidian">
            {Math.round((1 - product.price / product.compareAt) * 100)}% Off
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={cn(
            'absolute right-3 flex h-9 w-9 items-center justify-center bg-cream/90 backdrop-blur-sm transition-all duration-300',
            product.compareAt ? 'top-12' : 'top-3',
            'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            saved && 'opacity-100',
          )}
        >
          <Heart
            className={cn('h-4 w-4', saved ? 'fill-obsidian text-obsidian' : 'text-obsidian')}
            strokeWidth={1.4}
          />
        </button>

        {/* Quick add — a size row slides up out of the same control. */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:block">
          <AnimatePresence mode="wait" initial={false}>
            {sizePickerOpen ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream/95 p-2 backdrop-blur-md"
              >
                <p className="eyebrow px-1 pb-2 text-[9px] text-muted">Select a size</p>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => quickAdd(size)}
                      className="min-w-9 flex-1 border border-line px-2 py-2 font-display text-[10px] font-medium uppercase tracking-[0.12em] transition-colors hover:border-obsidian hover:bg-obsidian hover:text-cream"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="trigger"
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => (singleSize ? quickAdd(product.sizes[0]) : setSizePickerOpen(true))}
                tabIndex={hovered ? 0 : -1}
                className="flex w-full items-center justify-center gap-2 bg-cream/95 py-3 font-display text-[10px] font-medium uppercase tracking-[0.2em] text-obsidian backdrop-blur-md transition-colors hover:bg-obsidian hover:text-cream"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                Quick Add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Meta */}
      <div className={cn('pt-4', compact && 'pt-3')}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn('truncate font-display font-medium tracking-tight', compact ? 'text-sm' : 'text-[15px]')}>
              <button type="button" onClick={() => openQuickView(product.id)} className="link-underline">
                {product.name}
              </button>
            </h3>
            <p className="eyebrow mt-1.5 text-[9px] text-muted">{product.category}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className={cn('font-display tabular-nums', compact ? 'text-sm' : 'text-[15px]')}>
              {formatPrice(product.price, currency)}
            </p>
            {product.compareAt && (
              <p className="text-xs text-muted line-through tabular-nums">
                {formatPrice(product.compareAt, currency)}
              </p>
            )}
          </div>
        </div>

        {/* Colour swatches */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.map((color, index) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setActiveColor(index)}
              aria-label={`${color.name} colourway`}
              aria-pressed={index === activeColor}
              title={color.name}
              className={cn(
                'h-4 w-4 rounded-full border transition-all duration-200',
                index === activeColor
                  ? 'border-obsidian ring-1 ring-obsidian ring-offset-2 ring-offset-cream'
                  : 'border-line hover:border-muted',
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
          <span className="ml-1 text-[11px] text-muted">{product.colors[activeColor].name}</span>
        </div>
      </div>

      {/* Mobile quick add — always visible, no hover to rely on. */}
      <button
        type="button"
        onClick={() => openQuickView(product.id)}
        className="mt-3 w-full border border-line py-2.5 font-display text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-obsidian sm:hidden"
      >
        Quick View
      </button>
    </article>
  )
}
