import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { cn } from '../lib/utils'
import SmartImage from './SmartImage'

/**
 * Toast stack. Sits above the drawers so "Added to bag" stays visible even
 * while the cart is sliding in.
 */
export default function Toaster() {
  const { toasts, dismissToast, ui } = useStore()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        'pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2',
        'transition-[right,bottom] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'sm:bottom-6 sm:left-auto sm:translate-x-0',
        // Step clear of the cart drawer so the Checkout button is never covered.
        ui.cart ? 'sm:right-[29rem]' : 'sm:right-6',
        // On mobile the drawer is full width, so drop the toast to the top instead.
        ui.cart && 'bottom-auto top-4 sm:top-auto',
      )}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 bg-obsidian p-3 text-cream shadow-2xl"
          >
            {toast.image ? (
              <SmartImage
                id={toast.image}
                alt=""
                label="Aura"
                width={120}
                sizes="48px"
                wrapperClassName="h-14 w-12 shrink-0"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream">
                <Check className="h-4 w-4 text-obsidian" strokeWidth={2.6} />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-display text-[11px] font-medium uppercase tracking-[0.16em]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="mt-1 truncate text-xs text-cream/65">{toast.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-1 text-cream/50 transition-colors hover:text-cream"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
