const MESSAGES = [
  'Free Worldwide Shipping on Orders Over $150',
  'New Autumn Collection — Volume 04 Now Live',
  'Complimentary Returns Within 30 Days',
  'Members Receive Early Access to Every Drop',
]

/**
 * A continuous marquee. The message list is rendered twice and the track is
 * translated by exactly -50%, so the loop restarts with no visible seam.
 */
export default function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-obsidian text-cream">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2.5 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {MESSAGES.map((message) => (
              <span
                key={message}
                className="eyebrow flex items-center px-6 text-[10px] text-cream/85"
              >
                {message}
                <span className="ml-6 text-cream/30">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
