import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { FREE_SHIPPING_THRESHOLD, PRODUCT_MAP } from '../data/products'
import { usePersistentState } from '../hooks/usePersistentState'

const StoreContext = createContext(null)

/**
 * A cart line is identified by product + size + colour, so the same jacket in
 * two sizes occupies two editable lines rather than silently merging.
 */
const lineKey = (productId, size, color) => `${productId}::${size}::${color}`

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { productId, size, color, qty } = action
      const key = lineKey(productId, size, color)
      const existing = state.find((line) => line.key === key)
      if (existing) {
        return state.map((line) =>
          line.key === key ? { ...line, qty: Math.min(line.qty + qty, 10) } : line,
        )
      }
      return [...state, { key, productId, size, color, qty }]
    }

    case 'remove':
      return state.filter((line) => line.key !== action.key)

    case 'qty': {
      if (action.qty < 1) return state.filter((line) => line.key !== action.key)
      return state.map((line) =>
        line.key === action.key ? { ...line, qty: Math.min(action.qty, 10) } : line,
      )
    }

    case 'size': {
      // Changing a size can collide with a line that already uses it — merge
      // the quantities instead of leaving two identical rows behind.
      const target = state.find((line) => line.key === action.key)
      if (!target || target.size === action.size) return state
      const nextKey = lineKey(target.productId, action.size, target.color)
      const collision = state.find((line) => line.key === nextKey)

      if (collision) {
        return state
          .filter((line) => line.key !== action.key)
          .map((line) =>
            line.key === nextKey ? { ...line, qty: Math.min(line.qty + target.qty, 10) } : line,
          )
      }
      return state.map((line) =>
        line.key === action.key ? { ...line, key: nextKey, size: action.size } : line,
      )
    }

    case 'clear':
      return []

    default:
      return state
  }
}

/** Lock body scroll while a drawer or modal owns the screen. */
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    // Compensate for the disappearing scrollbar so the page doesn't jump.
    const gap = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [locked])
}

/** Reject stored carts written by an older build, or hand-edited nonsense. */
const isValidCart = (value) =>
  Array.isArray(value) &&
  value.every(
    (line) =>
      line &&
      typeof line.key === 'string' &&
      typeof line.productId === 'string' &&
      Number.isFinite(line.qty) &&
      // A product that no longer exists must not resurrect itself in the bag.
      Boolean(PRODUCT_MAP[line.productId]),
  )

const isValidWishlist = (value) =>
  Array.isArray(value) && value.every((id) => typeof id === 'string' && PRODUCT_MAP[id])

export function StoreProvider({ children }) {
  const [storedCart, setStoredCart] = usePersistentState('cart', [], isValidCart)
  const [cart, dispatch] = useReducer(cartReducer, storedCart)
  const [wishlist, setWishlist] = usePersistentState('wishlist', [], isValidWishlist)
  const [currency, setCurrency] = usePersistentState('currency', 'USD', (v) =>
    typeof v === 'string',
  )
  const [recentIds, setRecentIds] = usePersistentState('recent', [], isValidWishlist)

  // Mirror every cart change back to storage.
  useEffect(() => {
    setStoredCart(cart)
  }, [cart, setStoredCart])

  // One object for every overlay keeps "is anything open?" a single question.
  const [ui, setUi] = useState({
    cart: false,
    search: false,
    mobileNav: false,
    sizeGuide: false,
    quickView: null, // product id
  })

  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const setPanel = useCallback((panel, value) => {
    setUi((prev) => ({ ...prev, [panel]: value }))
  }, [])

  const closeAll = useCallback(() => {
    setUi({ cart: false, search: false, mobileNav: false, sizeGuide: false, quickView: null })
  }, [])

  const pushToast = useCallback((toast) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration ?? 3600)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToCart = useCallback(
    (product, { size, color, qty = 1, openDrawer = true } = {}) => {
      const resolvedSize = size ?? product.sizes[0]
      const resolvedColor = color ?? product.colors[0].name
      dispatch({ type: 'add', productId: product.id, size: resolvedSize, color: resolvedColor, qty })
      pushToast({
        title: 'Added to bag',
        message: `${product.name} — ${resolvedColor}, ${resolvedSize}`,
        image: product.images[0],
      })
      if (openDrawer) setPanel('cart', true)
    },
    [pushToast, setPanel],
  )

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.includes(product.id)
        pushToast({
          title: exists ? 'Removed from wishlist' : 'Saved to wishlist',
          message: product.name,
          image: product.images[0],
          duration: 2400,
        })
        return exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
      })
    },
    [pushToast],
  )

  /* Derived cart figures — recomputed only when the cart itself changes. */
  const { lines, count, subtotal, savings } = useMemo(() => {
    const resolved = cart
      .map((line) => {
        const product = PRODUCT_MAP[line.productId]
        return product ? { ...line, product } : null
      })
      .filter(Boolean)

    return {
      lines: resolved,
      count: resolved.reduce((sum, line) => sum + line.qty, 0),
      subtotal: resolved.reduce((sum, line) => sum + line.product.price * line.qty, 0),
      savings: resolved.reduce(
        (sum, line) =>
          line.product.compareAt ? sum + (line.product.compareAt - line.product.price) * line.qty : sum,
        0,
      ),
    }
  }, [cart])

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const anyOverlayOpen = ui.cart || ui.search || ui.mobileNav || Boolean(ui.quickView)
  useScrollLock(anyOverlayOpen)

  // Escape closes the topmost overlay: size guide first, then everything else.
  useEffect(() => {
    if (!anyOverlayOpen && !ui.sizeGuide) return
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (ui.sizeGuide) setPanel('sizeGuide', false)
      else closeAll()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [anyOverlayOpen, ui.sizeGuide, closeAll, setPanel])

  const value = useMemo(
    () => ({
      // cart
      lines,
      count,
      subtotal,
      savings,
      remainingForFreeShipping,
      shippingProgress,
      addToCart,
      removeLine: (key) => dispatch({ type: 'remove', key }),
      updateQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      updateSize: (key, size) => dispatch({ type: 'size', key, size }),
      clearCart: () => dispatch({ type: 'clear' }),
      // wishlist
      wishlist,
      toggleWishlist,
      // ui
      ui,
      setPanel,
      closeAll,
      openQuickView: (id) => {
        setPanel('quickView', id)
        // Most-recent first, no duplicates, capped at eight.
        setRecentIds((prev) => [id, ...prev.filter((entry) => entry !== id)].slice(0, 8))
      },
      recentlyViewed: recentIds
        .map((id) => PRODUCT_MAP[id])
        .filter(Boolean),
      // currency
      currency,
      setCurrency,
      // toasts
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      lines, count, subtotal, savings, remainingForFreeShipping, shippingProgress,
      addToCart, wishlist, toggleWishlist, ui, setPanel, closeAll, currency, toasts,
      pushToast, dismissToast, recentIds, setRecentIds, setCurrency,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside <StoreProvider>')
  return context
}
