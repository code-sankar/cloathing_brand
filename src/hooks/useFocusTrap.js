import { useEffect } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Keep Tab inside an open overlay, and hand focus back where it came from on
 * close. Without this a keyboard user tabs straight out of the cart and into
 * the page behind it, which is the most common way a drawer fails an audit.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const previouslyFocused = document.activeElement

    // Move focus into the panel, preferring its first real control.
    const focusFirst = () => {
      const target = node.querySelector(FOCUSABLE)
      if (target) target.focus()
      else {
        node.setAttribute('tabindex', '-1')
        node.focus()
      }
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      node.removeEventListener('keydown', onKeyDown)
      // Only restore if focus is still inside the panel we are closing.
      if (previouslyFocused?.isConnected && node.contains(document.activeElement)) {
        previouslyFocused.focus()
      }
    }
  }, [ref, active])
}
