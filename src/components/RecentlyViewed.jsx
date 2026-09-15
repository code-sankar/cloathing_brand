import { motion } from 'framer-motion'
import { useStore } from '../store/StoreContext'
import { formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

/**
 * A rail of pieces the shopper has already opened. It only renders once there
 * is history worth showing, and it survives a reload along with the bag.
 */
export default function RecentlyViewed() {
  const { recentlyViewed, openQuickView, currency } = useStore()

  if (recentlyViewed.length < 2) return null

  return (
    <motion.section
      aria-label="Recently viewed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-line bg-cream"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="eyebrow text-muted">Recently Viewed</h2>
          <p className="text-xs text-muted tabular-nums">{recentlyViewed.length} pieces</p>
        </div>

        <ul className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          {recentlyViewed.map((product) => (
            <li key={product.id} className="w-36 shrink-0 sm:w-44">
              <button
                type="button"
                onClick={() => openQuickView(product.id)}
                className="group block w-full text-left"
              >
                <SmartImage
                  id={product.images[0]}
                  alt={product.name}
                  label={product.name}
                  width={360}
                  sizes="176px"
                  wrapperClassName="aspect-3/4 w-full"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <p className="mt-3 truncate font-display text-[13px] font-medium tracking-tight">
                  {product.name}
                </p>
                <p className="mt-1 font-display text-xs text-muted tabular-nums">
                  {formatPrice(product.price, currency)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
