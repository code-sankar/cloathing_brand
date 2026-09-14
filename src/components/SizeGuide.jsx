import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../store/StoreContext'

const ROWS = [
  { size: 'XS', chest: '86–91', waist: '71–76', length: '68' },
  { size: 'S', chest: '91–97', waist: '76–81', length: '70' },
  { size: 'M', chest: '97–102', waist: '81–86', length: '72' },
  { size: 'L', chest: '102–107', waist: '86–94', length: '74' },
  { size: 'XL', chest: '107–114', waist: '94–102', length: '76' },
]

/**
 * Size guide overlay. It sits above the quick-view modal, so it carries a
 * higher z-index and its own backdrop.
 */
export default function SizeGuide() {
  const { ui, setPanel } = useStore()

  return (
    <AnimatePresence>
      {ui.sizeGuide && (
        <div className="fixed inset-0 z-[95]">
          <motion.button
            type="button"
            aria-label="Close size guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setPanel('sizeGuide', false)}
            className="absolute inset-0 w-full cursor-default bg-obsidian/50 backdrop-blur-sm"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 38 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-cream shadow-2xl scrollbar-slim"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em]">
                Size Guide
              </h2>
              <button
                type="button"
                onClick={() => setPanel('sizeGuide', false)}
                aria-label="Close size guide"
                className="text-muted transition-colors hover:text-obsidian"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-charcoal">
                Measurements are taken flat and listed in centimetres. Our cuts run
                relaxed — if you sit between two sizes and prefer a trim line, take
                the smaller.
              </p>

              <div className="mt-7 overflow-x-auto">
                <table className="w-full min-w-[26rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-obsidian">
                      {['Size', 'Chest', 'Waist', 'Back Length'].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="eyebrow py-3 pr-4 text-[9px] text-obsidian"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row) => (
                      <tr key={row.size} className="border-b border-line">
                        <th scope="row" className="py-3.5 pr-4 font-display text-sm font-medium">
                          {row.size}
                        </th>
                        <td className="py-3.5 pr-4 text-sm text-charcoal tabular-nums">{row.chest}</td>
                        <td className="py-3.5 pr-4 text-sm text-charcoal tabular-nums">{row.waist}</td>
                        <td className="py-3.5 pr-4 text-sm text-charcoal tabular-nums">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-haze p-5">
                <p className="eyebrow text-[10px]">How to measure</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-charcoal">
                  <li>
                    <span className="font-medium text-obsidian">Chest</span> — measured
                    one inch below the armhole, across the garment.
                  </li>
                  <li>
                    <span className="font-medium text-obsidian">Waist</span> — measured
                    at the narrowest point, flat.
                  </li>
                  <li>
                    <span className="font-medium text-obsidian">Back length</span> — from
                    the high point of the shoulder to the hem.
                  </li>
                </ul>
              </div>

              <p className="mt-6 text-xs text-muted">
                Still unsure? Write to concierge@auraatelier.com and we'll size you by
                hand.
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
