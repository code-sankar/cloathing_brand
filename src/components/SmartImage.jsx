import { useState } from 'react'
import { cn } from '../lib/utils'
import { fallbackImage, photo, photoSrcSet } from '../lib/images'

/**
 * An <img> that degrades gracefully.
 *
 * Product photography comes from the Unsplash CDN, which we don't control. If
 * a photo is retired or the network is unavailable, we swap in an on-brand SVG
 * placeholder rather than showing a broken-image icon. A quiet shimmer covers
 * the gap while the real photo decodes.
 *
 * The status is tracked alongside the id it belongs to, for two reasons:
 * a new `id` has to start loading afresh, and — more importantly — a failed
 * photo must *stay* failed. The fallback itself loads successfully, so an
 * unguarded onLoad would reset the status, restore the dead remote URL, and
 * spin up an endless error/load request loop.
 */
export default function SmartImage({
  id,
  alt,
  label,
  ratio = '3 / 4',
  width = 1200,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  className,
  wrapperClassName,
  priority = false,
  fallbackText = true,
  ...props
}) {
  const [state, setState] = useState({ id, status: 'loading' })

  // Derive fresh state when the photo changes, without an extra render pass.
  if (state.id !== id) setState({ id, status: 'loading' })

  const isFallback = state.status === 'error'
  const src = isFallback ? fallbackImage(label ?? alt, ratio, fallbackText) : photo(id, width)

  return (
    <span className={cn('relative block overflow-hidden bg-haze', wrapperClassName)}>
      {state.status === 'loading' && (
        <span aria-hidden className="absolute inset-0 animate-shimmer bg-haze" />
      )}
      <img
        key={isFallback ? 'fallback' : 'remote'}
        src={src}
        srcSet={isFallback ? undefined : photoSrcSet(id)}
        sizes={isFallback ? undefined : sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={() =>
          setState((prev) => (prev.status === 'error' ? prev : { id, status: 'loaded' }))
        }
        onError={() => setState({ id, status: 'error' })}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-700',
          state.status === 'loading' ? 'opacity-0' : 'opacity-100',
          className,
        )}
        {...props}
      />
    </span>
  )
}
