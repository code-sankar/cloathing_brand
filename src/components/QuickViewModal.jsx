import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, Ruler, Star, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { PRODUCT_MAP } from '../data/products'
import { cn, formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'
import Button from './Button'

export default function QuickViewModal() {
  const {
    ui, setPanel, closeAll, addToCart, toggleWishlist,
    wishlist, currency,
  } = useStore()

  const product = ui.quickView ? PRODUCT_MAP[ui.quickView] : null

  const [imageIndex, setImageIndex] = useState(0)
  const [size, setSize] = useState(null)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const panelRef = useRef(null)
  useFocusTrap(panelRef, Boolean(product))

  // Reset per-product selections whenever a different piece is opened.
  useEffect(() => {
    if (!product) return
    setImageIndex(0)
    setColorIndex(0)
    setQty(1)
    setJustAdded(false)
    setSize(product.sizes.length === 1 ? product.sizes[0] : null)
  }, [product])

  const imageCount = product?.images.length ?? 0
  const step = useCallback(
    (delta) => setImageIndex((prev) => (prev + delta + imageCount) % imageCount),
    [imageCount],
  )

  useEffect(() => {
    if (!product) return
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [product, step])

  if (!product) return <AnimatePresence />

  const saved = wishlist.includes(product.id)

  const close = () => setPanel('quickView', null)

  const handleAdd = () => {
    if (!size) return
    addToCart(product, {
      size,
      color: product.colors[colorIndex].name,
      qty,
      openDrawer: false,
    })
    // Hold the confirmed state briefly, then hand over to the cart drawer.
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      closeAll()
      setPanel('cart', true)
    }, 900)
  }

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close quick view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="absolute inset-0 w-full cursor-default bg-obsidian/45 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            initial={{ opacity: 0, y: 40, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden bg-cream shadow-2xl sm:max-h-[88vh] sm:flex-row"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center bg-cream/90 text-obsidian backdrop-blur-sm transition-colors hover:bg-obsidian hover:text-cream"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Gallery */}
            <div className="flex shrink-0 flex-col bg-haze sm:w-1/2">
              <div className="group/gallery relative h-[38svh] w-full shrink-0 overflow-hidden sm:h-auto sm:flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={imageIndex}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <SmartImage
                      id={product.images[imageIndex]}
                      alt={`${product.name}, view ${imageIndex + 1}`}
                      label={product.name}
                      width={1000}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      priority
                      wrapperClassName="h-full w-full"
                    />
                  </motion.div>
                </AnimatePresence>

                {imageCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-cream/85 text-obsidian opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-cream focus-visible:opacity-100 group-hover/gallery:opacity-100"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-cream/85 text-obsidian opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-cream focus-visible:opacity-100 group-hover/gallery:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show view ${index + 1}`}
                    aria-pressed={index === imageIndex}
                    className={cn(
                      'relative h-16 w-13 shrink-0 overflow-hidden border transition-all duration-300 sm:h-20 sm:w-16',
                      index === imageIndex
                        ? 'border-obsidian opacity-100'
                        : 'border-transparent opacity-55 hover:opacity-100',
                    )}
                  >
                    <SmartImage
                      id={image}
                      alt=""
                      label={product.name}
                      width={160}
                      sizes="64px"
                      wrapperClassName="h-full w-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-slim sm:px-8 sm:py-9">
              <p className="eyebrow text-muted">{product.category}</p>

              <h2 className="display mt-3 text-3xl sm:text-4xl">{product.name}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-xl tabular-nums">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.compareAt && (
                    <span className="text-sm text-muted line-through tabular-nums">
                      {formatPrice(product.compareAt, currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3 w-3',
                          i < Math.round(product.rating)
                            ? 'fill-obsidian text-obsidian'
                            : 'text-line',
                        )}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted tabular-nums">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-charcoal">{product.description}</p>

              {/* Colour */}
              <div className="mt-7">
                <p className="eyebrow text-[10px] text-muted">
                  Colour — <span className="text-obsidian">{product.colors[colorIndex].name}</span>
                </p>
                <div className="mt-3 flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setColorIndex(index)}
                      aria-label={color.name}
                      aria-pressed={index === colorIndex}
                      title={color.name}
                      className={cn(
                        'h-7 w-7 rounded-full border transition-all duration-200',
                        index === colorIndex
                          ? 'border-obsidian ring-1 ring-obsidian ring-offset-2 ring-offset-cream'
                          : 'border-line hover:border-muted',
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-[10px] text-muted">
                    Size {size && <span className="text-obsidian">— {size}</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPanel('sizeGuide', true)}
                    className="link-underline flex items-center gap-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-charcoal"
                  >
                    <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Size Guide
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSize(option)}
                      aria-pressed={option === size}
                      className={cn(
                        'min-w-14 border px-4 py-2.5 font-display text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-200',
                        option === size
                          ? 'border-obsidian bg-obsidian text-cream'
                          : 'border-line text-charcoal hover:border-obsidian',
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + actions */}
              <div className="mt-7 flex items-center gap-3">
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-haze"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                  <span className="w-9 text-center font-display text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-haze"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>

                <Button
                  onClick={handleAdd}
                  disabled={!size || justAdded}
                  className="flex-1 disabled:opacity-100"
                  size="lg"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" strokeWidth={2.4} />
                        Added
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                      >
                        {size ? 'Add to Bag' : 'Select a Size'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={saved}
                  className="flex h-14 w-14 shrink-0 items-center justify-center border border-line transition-colors hover:border-obsidian"
                >
                  <Heart
                    className={cn('h-4 w-4', saved && 'fill-obsidian')}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Details list */}
              <ul className="mt-8 space-y-2 border-t border-line pt-6">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    {detail}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs text-muted">
                Free express shipping over {formatPrice(150, currency)} · 30-day returns
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
