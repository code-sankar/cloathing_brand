import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { cn } from '../lib/utils'
import AnnouncementBar from './AnnouncementBar'

const LINKS = [
  { label: 'New Arrivals', href: '#catalogue' },
  { label: 'Men', href: '#catalogue' },
  { label: 'Women', href: '#catalogue' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Sale', href: '#catalogue' },
]

/** A small circular count badge that pops when its value changes. */
function CountBadge({ value }) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={value}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 24 }}
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-obsidian px-1 font-display text-[10px] font-semibold leading-none text-cream"
        >
          {value > 99 ? '99+' : value}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const { count, wishlist, setPanel, ui } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobileNav = () => setPanel('mobileNav', false)

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div
        className={cn(
          'backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled ? 'bg-cream/80 shadow-[0_1px_0_rgba(15,15,15,0.08)]' : 'bg-cream/60',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 transition-all duration-500 sm:gap-6 sm:px-6 lg:px-10',
            scrolled ? 'h-16' : 'h-20',
          )}
        >
          {/* Left: logo + primary links */}
          <div className="flex items-center gap-10">
            <a
              href="#top"
              className="font-display text-[13px] font-semibold uppercase leading-none tracking-[0.18em] text-obsidian sm:text-base sm:tracking-[0.32em] lg:text-lg"
            >
              Aura
              <span className="ml-1 font-normal text-muted sm:ml-1.5">Atelier</span>
            </a>

            <ul className="hidden items-center gap-8 lg:flex">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      'link-underline font-display text-[11px] font-medium uppercase tracking-[0.18em] text-obsidian/80 transition-colors hover:text-obsidian',
                      link.label === 'Sale' && 'text-obsidian',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: utilities */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setPanel('search', true)}
              aria-label="Search products"
              className="flex h-10 w-9 items-center justify-center text-obsidian transition-transform duration-300 hover:scale-110 sm:w-10"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </button>

            <button
              type="button"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative hidden h-10 w-10 items-center justify-center text-obsidian transition-transform duration-300 hover:scale-110 sm:flex"
            >
              <Heart
                className={cn('h-[18px] w-[18px]', wishlist.length > 0 && 'fill-obsidian')}
                strokeWidth={1.4}
              />
              <CountBadge value={wishlist.length} />
            </button>

            <button
              type="button"
              onClick={() => setPanel('cart', true)}
              aria-label={`Open shopping bag, ${count} items`}
              className="relative flex h-10 w-9 items-center justify-center text-obsidian transition-transform duration-300 hover:scale-110 sm:w-10"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
              <CountBadge value={count} />
            </button>

            <button
              type="button"
              onClick={() => setPanel('mobileNav', true)}
              aria-label="Open menu"
              className="flex h-10 w-9 items-center justify-center text-obsidian sm:w-10 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {ui.mobileNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-cream lg:hidden"
          >
            <div className="flex h-20 items-center justify-between px-4 sm:px-6">
              <span className="font-display text-base font-semibold uppercase tracking-[0.32em]">
                Aura<span className="ml-1.5 font-normal text-muted">Atelier</span>
              </span>
              <button
                type="button"
                onClick={closeMobileNav}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <ul className="px-4 pt-6 sm:px-6">
              {LINKS.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line"
                >
                  <a
                    href={link.href}
                    onClick={closeMobileNav}
                    className="display block py-5 text-4xl tracking-[-0.02em]"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="px-4 pt-10 sm:px-6">
              <p className="eyebrow text-muted">Need a hand?</p>
              <a href="#footer" onClick={closeMobileNav} className="mt-2 block text-sm text-charcoal">
                concierge@auraatelier.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
