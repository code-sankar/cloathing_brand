/**
 * Imagery helpers.
 *
 * Product and editorial photography is served straight from the Unsplash CDN.
 * Because a remote CDN can always fail (a retired photo, an offline shopper, a
 * blocked network), every URL is paired with `fallbackImage()` — an inline SVG
 * in the brand palette that keeps a failed load looking deliberate instead of
 * broken. `SmartImage` wires the two together.
 */

const UNSPLASH = 'https://images.unsplash.com'

/** Build a sized, optimised Unsplash URL for a raw photo id. */
export function photo(id, width = 1200) {
  return `${UNSPLASH}/${id}?auto=format&fit=crop&w=${width}&q=80`
}

/** Build a responsive srcset so phones never download a 1600px hero. */
export function photoSrcSet(id, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ')
}

/**
 * An on-brand placeholder rendered as a data URI.
 * Used as the error state for any image that fails to load.
 */
export function fallbackImage(label = 'AURA ATELIER', ratio = '3 / 4', withText = true) {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()) * 400)
  const safe = String(label)
    .toUpperCase()
    .replace(/[<>&"']/g, '')
    .slice(0, 28)

  // Images that carry overlaid type (hero, lookbook) take the wordless
  // variant, so the placeholder never competes with the headline above it.
  const caption = withText
    ? `<text x="50%" y="47%" text-anchor="middle"
        font-family="Inter Tight, Helvetica, Arial, sans-serif"
        font-size="${Math.round(w * 0.05)}" font-weight="500"
        letter-spacing="${Math.round(w * 0.012)}" fill="#0F0F0F">AURA ATELIER</text>
      <text x="50%" y="54%" text-anchor="middle"
        font-family="Inter, Helvetica, Arial, sans-serif"
        font-size="${Math.round(w * 0.032)}"
        letter-spacing="${Math.round(w * 0.006)}" fill="#8A8A85">${safe}</text>`
    : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F3F3F1"/>
        <stop offset="100%" stop-color="#E4E2DD"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${caption}
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
