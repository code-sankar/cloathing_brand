import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { CURRENCIES, cn } from '../lib/utils'

const COLUMNS = [
  {
    heading: 'Help',
    links: ['Contact Concierge', 'Order Status', 'Product Care', 'Size Guide', 'FAQ'],
  },
  {
    heading: 'Shipping',
    links: ['Delivery Options', 'Express Worldwide', 'Click & Collect', 'Customs & Duties'],
  },
  {
    heading: 'Returns',
    links: ['Start a Return', 'Returns Policy', 'Exchanges', 'Repairs & Alterations'],
  },
  {
    heading: 'Atelier',
    links: ['Our Materials', 'Sustainability', 'Stockists', 'Careers', 'Press'],
  },
]

const SOCIALS = ['Instagram', 'Pinterest', 'TikTok', 'Substack']

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | success | error

  const submit = (event) => {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setState('error')
      return
    }
    setState('success')
    setEmail('')
    // Return to the idle form so the demo can be replayed.
    setTimeout(() => setState('idle'), 5000)
  }

  return (
    <div className="max-w-md">
      <h3 className="display text-[clamp(1.75rem,4vw,2.75rem)] text-cream">
        First look, every drop
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-cream/60">
        Collection previews, restock notes, and the occasional letter from the
        atelier. No noise.
      </p>

      <div className="mt-6 min-h-24">
        <AnimatePresence mode="wait" initial={false}>
          {state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 border border-cream/25 bg-cream/5 p-4"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream">
                <Check className="h-3 w-3 text-obsidian" strokeWidth={3} />
              </span>
              <div>
                <p className="font-display text-sm font-medium tracking-tight text-cream">
                  You're on the list
                </p>
                <p className="mt-1 text-xs text-cream/60">
                  Look for a welcome note in your inbox shortly.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              noValidate
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={cn(
                  'flex items-center border-b transition-colors',
                  state === 'error' ? 'border-red-400' : 'border-cream/30 focus-within:border-cream',
                )}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (state === 'error') setState('idle')
                  }}
                  placeholder="Email address"
                  aria-invalid={state === 'error'}
                  className="w-full bg-transparent py-3 text-sm text-cream outline-none placeholder:text-cream/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="group flex h-11 w-11 shrink-0 items-center justify-center text-cream"
                >
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.6}
                  />
                </button>
              </div>

              <AnimatePresence>
                {state === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 text-xs text-red-300"
                  >
                    Please enter a valid email address.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CurrencySelect() {
  const { currency, setCurrency } = useStore()

  return (
    <div className="relative">
      <label htmlFor="currency" className="sr-only">
        Currency
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
        className="appearance-none border border-cream/25 bg-transparent py-2.5 pl-4 pr-9 font-display text-[11px] uppercase tracking-[0.16em] text-cream outline-none transition-colors hover:border-cream/60"
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code} className="bg-obsidian text-cream">
            {code}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/60"
        strokeWidth={1.6}
      />
    </div>
  )
}

export default function Footer() {
  return (
    <footer id="footer" className="bg-obsidian text-cream">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Newsletter />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h4 className="eyebrow text-[10px] text-cream/50">{column.heading}</h4>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#footer"
                        className="link-underline text-sm text-cream/80 transition-colors hover:text-cream"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-20 border-t border-cream/15 pt-10">
          <p
            aria-hidden
            className="display select-none text-[clamp(2.5rem,12vw,10rem)] leading-none text-cream/10"
          >
            AURA ATELIER
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-cream/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {SOCIALS.map((social) => (
              <a
                key={social}
                href="#footer"
                className="link-underline font-display text-[11px] uppercase tracking-[0.18em] text-cream/70 transition-colors hover:text-cream"
              >
                {social}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <CurrencySelect />
            <p className="text-[11px] text-cream/45">
              © {new Date().getFullYear()} Aura Atelier — a demo storefront.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
