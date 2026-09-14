/**
 * Editorial lookbook.
 *
 * Each look is one photograph in the asymmetric grid. `hotspots` are pins
 * placed in percentage coordinates over that photograph; each points at a
 * product id so "Shop the Look" can resolve the real catalogue entry.
 */
export const LOOKS = [
  {
    id: 'look-01',
    title: 'Northern Light',
    caption: 'Volume 04 — Autumn',
    image: 'photo-1483985988355-763728e1935b',
    span: 'tall',
    hotspots: [
      { id: 'h1', x: 52, y: 34, productId: 'kesa-wool-overcoat' },
      { id: 'h2', x: 44, y: 72, productId: 'oxide-relaxed-denim' },
    ],
  },
  {
    id: 'look-02',
    title: 'City Index',
    caption: 'Shot in Antwerp',
    image: 'photo-1490481651871-ab68de25d43d',
    span: 'wide',
    hotspots: [
      { id: 'h1', x: 38, y: 40, productId: 'loom-merino-knit' },
      { id: 'h2', x: 62, y: 66, productId: 'court-01-sneaker' },
    ],
  },
  {
    id: 'look-03',
    title: 'Off Duty',
    caption: 'The weekend edit',
    image: 'photo-1539109136881-3be0616acf4b',
    span: 'standard',
    hotspots: [{ id: 'h1', x: 50, y: 46, precision: true, productId: 'terrace-hooded-sweat' }],
  },
  {
    id: 'look-04',
    title: 'Atelier Hours',
    caption: 'Behind the seams',
    image: 'photo-1441984904996-e0b6ba687e04',
    span: 'standard',
    hotspots: [{ id: 'h1', x: 58, y: 52, productId: 'ridge-structured-tote' }],
  },
  {
    id: 'look-05',
    title: 'Long Coat Season',
    caption: 'Outerwear, examined',
    image: 'photo-1469334031218-e382a71b716b',
    span: 'wide',
    hotspots: [
      { id: 'h1', x: 34, y: 44, productId: 'atlas-trench' },
      { id: 'h2', x: 68, y: 38, productId: 'felt-brim-hat' },
    ],
  },
]
