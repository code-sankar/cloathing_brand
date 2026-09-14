import { cn } from '../lib/utils'

const VARIANTS = {
  solid:
    'bg-obsidian text-cream hover:bg-charcoal active:bg-obsidian disabled:bg-muted',
  outline:
    'border border-obsidian text-obsidian hover:bg-obsidian hover:text-cream disabled:border-line disabled:text-muted',
  ghost:
    'text-obsidian hover:bg-obsidian/5 disabled:text-muted',
  light:
    'bg-cream text-obsidian hover:bg-white',
}

const SIZES = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-12 px-7 text-xs',
  lg: 'h-14 px-9 text-xs',
}

/**
 * The house button: squared off, wide tracking, and a micro-interaction that
 * lifts on hover and settles on press.
 */
export default function Button({
  as: Component = 'button',
  variant = 'solid',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display font-medium uppercase tracking-[0.2em]',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
