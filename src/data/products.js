/**
 * Catalogue data.
 *
 * Prices are stored as plain USD numbers and converted at render time by
 * `formatPrice`, so the footer currency switcher never has to mutate state.
 * `releasedOn` drives the "Newest" sort; `rank` drives "Featured".
 */

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44', '45']
const ONE_SIZE = ['One Size']

export const CATEGORIES = ['All', 'Outerwear', 'Essentials', 'Footwear', 'Accessories']

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

export const PRODUCTS = [
  /* ----------------------------- Outerwear ----------------------------- */
  {
    id: 'kesa-wool-overcoat',
    name: 'Kesa Wool Overcoat',
    category: 'Outerwear',
    price: 890,
    compareAt: 1050,
    badge: 'Bestseller',
    rank: 1,
    releasedOn: '2026-08-14',
    rating: 4.8,
    reviews: 214,
    colors: [
      { name: 'Obsidian', hex: '#0F0F0F' },
      { name: 'Camel', hex: '#B08D63' },
      { name: 'Fog', hex: '#C9C7C1' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1611312449408-fcece27cdbb7',
      'photo-1518049362265-d5b2a6467637',
      'photo-1608234808654-2a8875faa7fd',
      'photo-1544022613-e87ca75a784a',
    ],
    description:
      'A double-faced Italian wool overcoat cut long through the body with a softly dropped shoulder. Unlined for a fluid drape that moves rather than holds.',
    details: ['80% virgin wool, 20% cashmere', 'Horn buttons, hand-finished', 'Woven in Biella, Italy'],
  },
  {
    id: 'norite-technical-shell',
    name: 'Norite Technical Shell',
    category: 'Outerwear',
    price: 640,
    badge: 'New Drop',
    rank: 4,
    releasedOn: '2026-09-06',
    rating: 4.7,
    reviews: 68,
    colors: [
      { name: 'Slate', hex: '#4A4E52' },
      { name: 'Bone', hex: '#E8E4DA' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1551028719-00167b16eac5',
      'photo-1591047139829-d91aecb6caea',
      'photo-1503341504253-dff4815485f1',
    ],
    description:
      'A three-layer waterproof shell with fully taped seams and a storm-tested hood. Engineered for weather, drawn to the proportions of a tailored jacket.',
    details: ['20K/20K waterproof membrane', 'Fully taped seams', 'PFC-free durable water repellent'],
  },
  {
    id: 'halden-cropped-bomber',
    name: 'Halden Cropped Bomber',
    category: 'Outerwear',
    price: 520,
    rank: 9,
    releasedOn: '2026-07-22',
    rating: 4.6,
    reviews: 97,
    colors: [
      { name: 'Charcoal', hex: '#333333' },
      { name: 'Olive', hex: '#5C5F4A' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1591047139829-d91aecb6caea',
      'photo-1551028719-00167b16eac5',
      'photo-1488161628813-04466f872be2',
    ],
    description:
      'A cropped bomber in washed cotton twill with ribbed trims and a clean, collarless neckline. Boxy through the chest, short at the hem.',
    details: ['Washed organic cotton twill', 'Two-way front zip', 'Ribbed cuffs and hem'],
  },
  {
    id: 'atlas-trench',
    name: 'Atlas Belted Trench',
    category: 'Outerwear',
    price: 780,
    rank: 11,
    releasedOn: '2026-06-30',
    rating: 4.9,
    reviews: 142,
    colors: [
      { name: 'Stone', hex: '#C2B59B' },
      { name: 'Obsidian', hex: '#0F0F0F' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1518049362265-d5b2a6467637',
      'photo-1611312449408-fcece27cdbb7',
      'photo-1487222477894-8943e31ef7b2',
    ],
    description:
      'The house trench, re-cut with a longer storm flap and a self-tie belt. Water-resistant cotton gabardine that softens with every wear.',
    details: ['Cotton gabardine, water-resistant finish', 'Removable self-tie belt', 'Vented back yoke'],
  },
  {
    id: 'meridian-quilted-liner',
    name: 'Meridian Quilted Liner',
    category: 'Outerwear',
    price: 430,
    compareAt: 495,
    rank: 14,
    releasedOn: '2026-05-18',
    rating: 4.5,
    reviews: 54,
    colors: [
      { name: 'Ink', hex: '#1D2733' },
      { name: 'Clay', hex: '#9C7B65' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1608234808654-2a8875faa7fd',
      'photo-1544022613-e87ca75a784a',
      'photo-1507003211169-0a1dd7228f2d',
    ],
    description:
      'A featherweight diamond-quilted liner built to wear alone or layer beneath the Kesa. Packs down to the size of a paperback.',
    details: ['Recycled nylon shell', 'Responsibly sourced down fill', 'Packs into its own pocket'],
  },

  /* ----------------------------- Essentials ---------------------------- */
  {
    id: 'ashen-heavyweight-tee',
    name: 'Ashen Heavyweight Tee',
    category: 'Essentials',
    price: 95,
    badge: 'New Drop',
    rank: 3,
    releasedOn: '2026-09-09',
    rating: 4.8,
    reviews: 412,
    colors: [
      { name: 'Cream', hex: '#F9F8F6' },
      { name: 'Obsidian', hex: '#0F0F0F' },
      { name: 'Ash', hex: '#8A8A85' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1521572163474-6864f9cf17ab',
      'photo-1576566588028-4147f3842f27',
      'photo-1618354691373-d851c5c3a990',
    ],
    description:
      'A 240gsm loopback tee with a firm rib collar that holds its shape past the hundredth wash. The one you reach for first.',
    details: ['240gsm organic cotton', 'Garment dyed, pre-shrunk', 'Boxy fit — size down for a trim cut'],
  },
  {
    id: 'loom-merino-knit',
    name: 'Loom Merino Knit',
    category: 'Essentials',
    price: 280,
    badge: 'Bestseller',
    rank: 2,
    releasedOn: '2026-08-28',
    rating: 4.9,
    reviews: 188,
    colors: [
      { name: 'Oat', hex: '#DCD3C2' },
      { name: 'Charcoal', hex: '#333333' },
      { name: 'Rust', hex: '#A4593A' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1516762689617-e1cffcef479d',
      'photo-1596755094514-f87e34085b2c',
      'photo-1485968579580-b6d095142e6e',
    ],
    description:
      'Extra-fine merino knitted on a twelve-gauge machine, with a fully fashioned shoulder that follows the body rather than fighting it.',
    details: ['100% extra-fine merino wool', 'Fully fashioned seams', 'Mulesing-free, traceable fibre'],
  },
  {
    id: 'terrace-hooded-sweat',
    name: 'Terrace Hooded Sweat',
    category: 'Essentials',
    price: 210,
    rank: 8,
    releasedOn: '2026-08-02',
    rating: 4.7,
    reviews: 263,
    colors: [
      { name: 'Heather', hex: '#B4B2AC' },
      { name: 'Obsidian', hex: '#0F0F0F' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1620012253295-c15cc3e65df4',
      'photo-1556821840-3a63f95609a7',
      'photo-1578587018452-892bacefd3f2',
    ],
    description:
      'Brushed-back French terry with a double-layer hood and a relaxed body. Heavy enough to stand on its own through autumn.',
    details: ['420gsm French terry', 'Double-layer hood', 'Raglan sleeve for range of motion'],
  },
  {
    id: 'oxide-relaxed-denim',
    name: 'Oxide Relaxed Denim',
    category: 'Essentials',
    price: 245,
    rank: 7,
    releasedOn: '2026-07-11',
    rating: 4.6,
    reviews: 156,
    colors: [
      { name: 'Raw Indigo', hex: '#2E3D54' },
      { name: 'Washed Black', hex: '#2B2B2B' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1542272604-787c3835535d',
      'photo-1541099649105-f69ad21f3246',
      'photo-1475178626620-a4d074967452',
    ],
    description:
      'Japanese selvedge denim cut with a straight, roomy leg and a mid rise. Raw, so it fades exactly where you wear it.',
    details: ['14.5oz Japanese selvedge', 'Raw — expect 1" shrink', 'Chain-stitched hem'],
  },
  {
    id: 'poplin-utility-shirt',
    name: 'Poplin Utility Shirt',
    category: 'Essentials',
    price: 185,
    rank: 12,
    releasedOn: '2026-06-14',
    rating: 4.5,
    reviews: 89,
    colors: [
      { name: 'Cream', hex: '#F9F8F6' },
      { name: 'Sage', hex: '#96A08C' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1581655353564-df123a1eb820',
      'photo-1602810318383-e386cc2a3ccf',
      'photo-1492562080023-ab3db95bfbce',
    ],
    description:
      'Crisp compact-cotton poplin with patch pockets and a soft-roll collar. Sharp enough for the office, easy enough for Sunday.',
    details: ['Compact cotton poplin', 'Mother-of-pearl buttons', 'Curved shirt-tail hem'],
  },
  {
    id: 'kiln-pleated-trouser',
    name: 'Kiln Pleated Trouser',
    category: 'Essentials',
    price: 265,
    rank: 13,
    releasedOn: '2026-05-29',
    rating: 4.7,
    reviews: 73,
    colors: [
      { name: 'Charcoal', hex: '#333333' },
      { name: 'Bone', hex: '#E8E4DA' },
    ],
    sizes: APPAREL_SIZES,
    images: [
      'photo-1624378439575-d8705ad7ae80',
      'photo-1475178626620-a4d074967452',
      'photo-1445205170230-053b83016050',
    ],
    description:
      'A single-pleat trouser in dry wool suiting, tapered gently from a high waist. Tailoring proportions, weekend ease.',
    details: ['Dry-finish wool suiting', 'Single forward pleat', 'Unfinished hem for tailoring'],
  },

  /* ------------------------------ Footwear ----------------------------- */
  {
    id: 'sable-leather-boot',
    name: 'Sable Leather Boot',
    category: 'Footwear',
    price: 495,
    badge: 'Bestseller',
    rank: 5,
    releasedOn: '2026-08-20',
    rating: 4.8,
    reviews: 176,
    colors: [
      { name: 'Espresso', hex: '#4A3428' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: SHOE_SIZES,
    images: [
      'photo-1550246140-29f40b909e5a',
      'photo-1460353581641-37baddab0fa2',
      'photo-1520975954732-35dd22299614',
    ],
    description:
      'A Goodyear-welted ankle boot in vegetable-tanned calf leather, built on a rounded last with a stacked leather heel.',
    details: ['Vegetable-tanned Italian calf', 'Goodyear welted — fully resoleable', 'Stacked leather heel'],
  },
  {
    id: 'court-01-sneaker',
    name: 'Court 01 Low Sneaker',
    category: 'Footwear',
    price: 320,
    badge: 'New Drop',
    rank: 6,
    releasedOn: '2026-09-11',
    rating: 4.6,
    reviews: 92,
    colors: [
      { name: 'Off-White', hex: '#F1EFE9' },
      { name: 'Obsidian', hex: '#0F0F0F' },
    ],
    sizes: SHOE_SIZES,
    images: [
      'photo-1549298916-b41d501d3772',
      'photo-1595950653106-6c9ebd614d3a',
      'photo-1560769629-975ec94e6a86',
    ],
    description:
      'A pared-back court shoe on a cupsole, with a single tonal panel and no visible branding. Quiet by design.',
    details: ['Full-grain leather upper', 'Vulcanised cupsole', 'Made in Portugal'],
  },
  {
    id: 'drift-runner',
    name: 'Drift Runner',
    category: 'Footwear',
    price: 290,
    compareAt: 340,
    rank: 15,
    releasedOn: '2026-07-04',
    rating: 4.4,
    reviews: 61,
    colors: [
      { name: 'Sand', hex: '#D6C7AE' },
      { name: 'Graphite', hex: '#55585C' },
    ],
    sizes: SHOE_SIZES,
    images: [
      'photo-1542291026-7eec264c27ff',
      'photo-1560769629-975ec94e6a86',
      'photo-1595950653106-6c9ebd614d3a',
    ],
    description:
      'A city runner with a sculpted EVA midsole and a breathable engineered mesh upper. Built for pavement, cut like a sneaker.',
    details: ['Engineered recycled mesh', 'Compression-moulded EVA midsole', 'Rubber outsole with 4mm drop'],
  },

  /* ---------------------------- Accessories ---------------------------- */
  {
    id: 'ridge-structured-tote',
    name: 'Ridge Structured Tote',
    category: 'Accessories',
    price: 390,
    badge: 'Bestseller',
    rank: 10,
    releasedOn: '2026-08-08',
    rating: 4.9,
    reviews: 134,
    colors: [
      { name: 'Tan', hex: '#A87B52' },
      { name: 'Obsidian', hex: '#0F0F0F' },
    ],
    sizes: ONE_SIZE,
    images: [
      'photo-1547996160-81dfa63595aa',
      'photo-1584917865442-de89df76afd3',
      'photo-1594633312681-425c7b97ccd1',
    ],
    description:
      'A structured tote in full-grain leather that holds a 16" laptop and softens into shape over the first season.',
    details: ['Full-grain vegetable-tanned leather', 'Suede-lined interior', 'Fits a 16" laptop'],
  },
  {
    id: 'ellipse-acetate-frames',
    name: 'Ellipse Acetate Frames',
    category: 'Accessories',
    price: 220,
    badge: 'New Drop',
    rank: 16,
    releasedOn: '2026-09-02',
    rating: 4.5,
    reviews: 47,
    colors: [
      { name: 'Tortoise', hex: '#6B4A2B' },
      { name: 'Obsidian', hex: '#0F0F0F' },
    ],
    sizes: ONE_SIZE,
    images: [
      'photo-1473966968600-fa801b869a1a',
      'photo-1511499767150-a48a237f0083',
      'photo-1572635196237-14b3f281503f',
    ],
    description:
      'Hand-polished Mazzucchelli acetate in a softened ellipse, with CR-39 lenses and a keyhole bridge.',
    details: ['Italian Mazzucchelli acetate', 'CR-39 polarised lenses', 'Hand-polished over 3 days'],
  },
  {
    id: 'felt-brim-hat',
    name: 'Wide Felt Brim Hat',
    category: 'Accessories',
    price: 165,
    rank: 17,
    releasedOn: '2026-06-21',
    rating: 4.3,
    reviews: 38,
    colors: [
      { name: 'Charcoal', hex: '#333333' },
      { name: 'Camel', hex: '#B08D63' },
    ],
    sizes: ['S / M', 'L / XL'],
    images: [
      'photo-1514996937319-344454492b37',
      'photo-1509319117193-57bab727e09d',
      'photo-1483118714900-540cf339fd46',
    ],
    description:
      'A wool-felt hat with a wide, hand-shaped brim and a grosgrain band. Blocked by hand in a workshop that has done it for eighty years.',
    details: ['100% wool felt', 'Hand-blocked brim', 'Grosgrain inner band'],
  },
  {
    id: 'mesa-leather-belt',
    name: 'Mesa Leather Belt',
    category: 'Accessories',
    price: 130,
    rank: 18,
    releasedOn: '2026-05-10',
    rating: 4.6,
    reviews: 71,
    colors: [
      { name: 'Cognac', hex: '#8B5A2B' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L'],
    images: [
      'photo-1520975954732-35dd22299614',
      'photo-1523170335258-f5ed11844a49',
      'photo-1553062407-98eeb64c6a62',
    ],
    description:
      'A 35mm bridle leather belt with a solid brass buckle, edge-painted by hand and finished with a single keeper.',
    details: ['English bridle leather', 'Solid brass buckle', 'Hand-painted edges'],
  },
]

/** Fast id → product lookup for the cart and lookbook hotspots. */
export const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

export const FREE_SHIPPING_THRESHOLD = 150
