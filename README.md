# AURA ATELIER

A demo storefront for a contemporary clothing label — built as a blend of
high-fashion editorial (minimal layout, bold display typography, full-bleed
imagery) and high-conversion e-commerce (quick-add, slide-over bag, interactive
filters).

![Autumn Volume 04](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80)

## Stack

| | |
|---|---|
| Build | Vite 8 + React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animation | framer-motion |
| Icons | lucide-react |
| Utilities | clsx + tailwind-merge |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

## Design system

Defined once as Tailwind v4 theme tokens in `src/index.css`, so every component
draws from the same palette and type scale.

| Token | Value | Use |
|---|---|---|
| `obsidian` | `#0F0F0F` | Primary ink, buttons, footer |
| `cream` | `#F9F8F6` | Page ground |
| `haze` | `#F3F3F1` | Card and panel backgrounds |
| `charcoal` | `#333333` | Body copy, accents |
| `line` | `#E4E2DD` | Hairlines and borders |
| `muted` | `#8A8A85` | Secondary text |

Type pairs **Inter Tight** (display, tight tracking at size) with **Inter**
(body) and **Instrument Serif** (editorial italic accents). Small all-caps
labels use the `.eyebrow` class; headlines use `.display`.

## Features

**Navigation** — Sticky `backdrop-blur-md` header that contracts on scroll, a
seamless announcement marquee, a search modal with live catalogue filtering,
and wishlist / bag counters that spring on change.

**Hero** — Full-height banner with a scroll-linked parallax backdrop, staggered
headline entrance, and a trust strip beneath.

**Catalogue** — Category pills with a shared-layout active indicator, a sort
dropdown (featured / price / newest), and a 3-up ↔ 4-up density toggle. Cards
cross-fade to a second look on hover and expose an inline quick-add size row.

**Bag** — A spring-driven slide-over with a live free-shipping progress bar,
per-line size switching, quantity steppers, and removal. Changing a line's size
into one that already exists merges the two rather than leaving duplicates.

**Quick view** — Modal with a thumbnail gallery, colour and size selection, a
size-guide drawer layered above it, and an add-to-bag confirmation that hands
off to the bag.

**Lookbook** — An asymmetric magazine grid with "shop the look" pins that open
a product card in place; the popover flips its anchor near the frame edges.

**Footer** — Newsletter capture with inline validation and a success state,
structured link columns, and a currency selector that re-denominates every
price on the page (USD / EUR / GBP / JPY).

## Imagery

Photography is loaded from the Unsplash CDN by photo id (`src/lib/images.js`),
with a responsive `srcset` so phones don't pull a 1600px hero.

Because that CDN is outside the app's control, `SmartImage` pairs every remote
URL with an on-brand SVG placeholder and swaps to it on error — a retired photo
or an offline shopper degrades to something deliberate rather than a broken
image icon. Images that carry overlaid type (hero, lookbook) use a wordless
variant of the placeholder.

## Project layout

```
src/
├── components/      Navbar, Hero, ProductGrid, ProductCard, CartDrawer,
│                    QuickViewModal, Lookbook, Footer, SearchModal,
│                    SizeGuide, Toaster, Marquee, SmartImage, Button
├── store/           StoreContext — cart reducer, wishlist, overlays, toasts
├── data/            products.js (18 pieces), lookbook.js
└── lib/             utils.js (cn, currency), images.js (URLs, fallback)
```

Cart state lives in a `useReducer` inside `StoreContext`; a line is keyed by
product + size + colour so the same piece in two sizes stays independently
editable. Derived figures (count, subtotal, savings, shipping progress) are
memoised off that state rather than tracked separately.

## Accessibility

Overlays are labelled dialogs that trap body scroll without layout shift and
close on Escape (the size guide closes first when stacked). Controls carry
`aria-pressed` / `aria-expanded` state, the toast region is `aria-live`, there
is a skip link to the catalogue, and every animation respects
`prefers-reduced-motion`.

---

A demo project — the checkout is simulated and takes no payment.
