import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { FREE_SHIPPING_THRESHOLD } from '../data/products'
import { cn, formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'
import Button from './Button'

/** Inline size switcher for a line already in the bag. */
function SizeSwitcher({ line, onChange }) {
  const [open, setOpen] = useState(false)

  if (line.product.sizes.length <= 1) {
    return <span className="text-xs text-muted">{line.size}</span>
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center gap-1 border border-line px-2.5 py-1 font-display text-[10px] font-medium uppercase tracking-[0.12em] transition-colors hover:border-obsidian"
      >
        Size {line.size}
        <span className="text-muted">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 z-20 mt-1 flex flex-wrap gap-1 border border-line bg-cream p-1.5 shadow-lg"
          >
            {line.product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  onChange(size)
                  setOpen(false)
                }}
                className={cn(
                  'min-w-9 px-2 py-1.5 font-display text-[10px] font-medium uppercase tracking-[0.12em] transition-colors',
                  size === line.size ? 'bg-obsidian text-cream' : 'hover:bg-haze',
                )}
              >
                {size}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CartDrawer() {
  const {
    ui, setPanel, lines, count, subtotal, savings,
    remainingForFreeShipping, shippingProgress,
    removeLine, updateQty, updateSize, currency, pushToast,
  } = useStore()

  const [checkingOut, setCheckingOut] = useState(false)
  const panelRef = useRef(null)
  const open = ui.cart
  useFocusTrap(panelRef, open)
  const qualifies = remainingForFreeShipping === 0

  const close = () => setPanel('cart', false)

  const checkout = () => {
    setCheckingOut(true)
    // Simulated payment hand-off — this is a demo storefront.
    setTimeout(() => {
      setCheckingOut(false)
      pushToast({
        title: 'Demo checkout',
        message: 'This storefront is a showcase — no payment was taken.',
        duration: 4200,
      })
    }, 1400)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label="Close bag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            className="absolute inset-0 w-full cursor-default bg-obsidian/40 backdrop-blur-sm"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38, mass: 0.9 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-6">
              <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em]">
                Your Bag
                <span className="ml-2 text-muted tabular-nums">({count})</span>
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="text-muted transition-colors hover:text-obsidian"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2 text-xs">
                {qualifies ? (
                  <>
                    <Check className="h-3.5 w-3.5 shrink-0 text-obsidian" strokeWidth={2.2} />
                    <span className="font-medium text-obsidian">
                      Free Express Shipping unlocked
                    </span>
                  </>
                ) : (
                  <>
                    <Truck className="h-3.5 w-3.5 shrink-0 text-charcoal" strokeWidth={1.5} />
                    <span className="text-charcoal">
                      Add{' '}
                      <span className="font-semibold text-obsidian tabular-nums">
                        {formatPrice(remainingForFreeShipping, currency)}
                      </span>{' '}
                      more for Free Express Shipping
                    </span>
                  </>
                )}
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-obsidian"
                  initial={false}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted tabular-nums">
                <span>{formatPrice(subtotal, currency)}</span>
                <span>{formatPrice(FREE_SHIPPING_THRESHOLD, currency)}</span>
              </div>
            </div>

            {/* Lines */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag className="h-9 w-9 text-line" strokeWidth={1} />
                <div>
                  <p className="font-display text-sm font-medium uppercase tracking-[0.16em]">
                    Your bag is empty
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Pieces you add will rest here until you're ready.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={close}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 scrollbar-slim sm:px-6">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 py-5">
                        <SmartImage
                          id={line.product.images[0]}
                          alt={line.product.name}
                          label={line.product.name}
                          width={240}
                          sizes="88px"
                          wrapperClassName="h-28 w-22 shrink-0"
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="truncate font-display text-sm font-medium tracking-tight">
                                {line.product.name}
                              </h3>
                              <p className="shrink-0 font-display text-sm tabular-nums">
                                {formatPrice(line.product.price * line.qty, currency)}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-muted">{line.color}</p>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <SizeSwitcher
                              line={line}
                              onChange={(size) => updateSize(line.key, size)}
                            />

                            <div className="flex items-center gap-1">
                              <div className="flex items-center border border-line">
                                <button
                                  type="button"
                                  onClick={() => updateQty(line.key, line.qty - 1)}
                                  aria-label={`Decrease quantity of ${line.product.name}`}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-haze"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={1.8} />
                                </button>
                                <span className="w-8 text-center font-display text-xs tabular-nums">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQty(line.key, line.qty + 1)}
                                  disabled={line.qty >= 10}
                                  aria-label={`Increase quantity of ${line.product.name}`}
                                  className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-haze disabled:text-line"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={1.8} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeLine(line.key)}
                                aria-label={`Remove ${line.product.name} from bag`}
                                className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-obsidian"
                              >
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* Summary */}
            {lines.length > 0 && (
              <div className="border-t border-line px-5 py-5 sm:px-6">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-charcoal">Subtotal</dt>
                    <dd className="font-display tabular-nums">{formatPrice(subtotal, currency)}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal">You save</dt>
                      <dd className="font-display tabular-nums">
                        −{formatPrice(savings, currency)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-charcoal">Shipping</dt>
                    <dd className="font-display tabular-nums">
                      {qualifies ? 'Free' : 'Calculated at checkout'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-display text-sm font-medium uppercase tracking-[0.16em]">
                    Total
                  </span>
                  <span className="font-display text-xl tabular-nums">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                <Button
                  onClick={checkout}
                  disabled={checkingOut}
                  className="group mt-4 w-full"
                  size="lg"
                >
                  {checkingOut ? (
                    'Processing…'
                  ) : (
                    <>
                      Checkout
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={1.6}
                      />
                    </>
                  )}
                </Button>

                <p className="mt-3 text-center text-[11px] text-muted">
                  Taxes and duties calculated at checkout · Demo storefront
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
