import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { HERO_CLIPS, POSTER_INTERVAL_MS } from '../data/hero'
import { cn } from '../lib/utils'
import SmartImage from './SmartImage'

/** Backstop: a clip that produces no event at all still has to give way. */
const LOAD_TIMEOUT_MS = 7000

/** HTMLMediaElement.NETWORK_NO_SOURCE — every candidate source was exhausted. */
const NETWORK_NO_SOURCE = 3

/**
 * Should we even attempt video? Honour reduced-motion and the browser's
 * data-saver hint — on a metered connection an autoplaying reel is hostile.
 */
function useVideoAllowed() {
  const reduceMotion = useReducedMotion()
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const connection = navigator.connection
    if (!connection) return
    const read = () =>
      setSaveData(Boolean(connection.saveData) || /(^|-)2g$/.test(connection.effectiveType ?? ''))
    read()
    connection.addEventListener?.('change', read)
    return () => connection.removeEventListener?.('change', read)
  }, [])

  return !reduceMotion && !saveData
}

/**
 * The hero backdrop: a poster still that hands over to video the moment the
 * video is genuinely rendering frames.
 *
 * The handoff is driven by the `playing` event rather than `canplay`, because
 * "has enough data" is not the same as "is on screen" — waiting for real
 * playback is what stops the black flash between poster and first frame.
 *
 * Every failure route lands back on the poster: a clip whose sources all 404,
 * a decode error, refused autoplay, or a load that simply hangs past
 * LOAD_TIMEOUT_MS. In that state the reel keeps moving by crossfading stills.
 */
export default function HeroMedia({ mediaStyle }) {
  const videoAllowed = useVideoAllowed()

  const [index, setIndex] = useState(0)
  const [videoReady, setVideoReady] = useState(false) // frames are painting
  const [failed, setFailed] = useState(false) // this clip cannot play
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)

  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const clip = HERO_CLIPS[index]

  const select = useCallback((next) => {
    setVideoReady(false)
    setFailed(false)
    setPaused(false)
    setIndex(next)
  }, [])

  const advance = useCallback(
    () => select((index + 1) % HERO_CLIPS.length),
    [index, select],
  )

  /* ------------------------------------------------------------------ *
   * Playback: load the selected clip, start it as soon as it can play.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoAllowed) return

    let cancelled = false
    const fail = () => !cancelled && setFailed(true)

    // React sets the muted *property* but not always the attribute, and the
    // attribute is what autoplay policies read. Set both, before load().
    video.muted = true
    video.setAttribute('muted', '')
    setMuted(true)

    // A changed <source> list needs an explicit load() to restart selection.
    video.load()

    const start = () => {
      if (cancelled) return
      video.play()?.catch?.(fail) // autoplay refused → keep the poster
    }

    const onPlaying = () => !cancelled && setVideoReady(true)

    // When <source> children are used, exhausting the candidate list fires
    // `error` at the last *source* — not at the media element, whose own
    // `error` stays null. Watch both, and confirm via networkState.
    const onSourceError = () => {
      queueMicrotask(() => {
        if (!cancelled && video.networkState === NETWORK_NO_SOURCE) fail()
      })
    }
    const sources = Array.from(video.querySelectorAll('source'))
    sources.forEach((source) => source.addEventListener('error', onSourceError))

    video.addEventListener('canplay', start)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', fail)
    video.addEventListener('ended', advance)

    // Covers the case where enough data arrived before listeners attached.
    if (video.readyState >= 3) start()

    // A stalled network can leave us with no event at all — don't hang.
    const timeout = setTimeout(() => {
      if (!cancelled && video.readyState < 3) fail()
    }, LOAD_TIMEOUT_MS)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      sources.forEach((source) => source.removeEventListener('error', onSourceError))
      video.removeEventListener('canplay', start)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', fail)
      video.removeEventListener('ended', advance)
    }
  }, [index, videoAllowed, advance])

  /* Stop decoding once the hero is off screen — it is pure battery cost. */
  useEffect(() => {
    const node = containerRef.current
    const video = videoRef.current
    if (!node || !video || !videoAllowed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!paused) video.play()?.catch?.(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [videoAllowed, paused, index])

  /* When video isn't carrying the hero, keep it alive by cycling stills. */
  const stillsOnly = !videoAllowed || failed
  useEffect(() => {
    if (!stillsOnly) return
    const timer = setTimeout(advance, POSTER_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [stillsOnly, index, advance])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()?.catch?.(() => setFailed(true))
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    const next = !video.muted
    video.muted = next
    if (next) video.setAttribute('muted', '')
    else video.removeAttribute('muted')
    setMuted(next)
  }

  const videoLive = videoReady && !failed

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Only the media drifts with scroll — the controls must stay put. */}
      <motion.div style={mediaStyle} className="absolute inset-0 scale-110">
        {/* Poster layer — painted immediately, and the resting state
            whenever video is unavailable. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={clip.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <SmartImage
            id={clip.poster}
            alt={clip.alt}
            label={clip.label}
            ratio="16 / 9"
            width={2000}
            sizes="100vw"
            priority={index === 0}
            fallbackText={false}
            wrapperClassName="h-full w-full bg-obsidian"
            className="object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Video layer — mounted only when allowed, revealed only once playing. */}
      {videoAllowed && (
        <video
          key={clip.id}
          ref={videoRef}
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
            videoLive ? 'opacity-100' : 'opacity-0',
          )}
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          {clip.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      </motion.div>

      {/* Reel controls */}
      <div className="absolute bottom-5 right-4 z-20 flex items-center gap-3 sm:bottom-7 sm:right-6 lg:right-10">
        {videoLive && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={paused ? 'Play hero reel' : 'Pause hero reel'}
              className="flex h-9 w-9 items-center justify-center border border-cream/30 text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-cream hover:text-obsidian"
            >
              {paused ? (
                <Play className="h-3.5 w-3.5" strokeWidth={1.6} />
              ) : (
                <Pause className="h-3.5 w-3.5" strokeWidth={1.6} />
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute hero reel' : 'Mute hero reel'}
              className="flex h-9 w-9 items-center justify-center border border-cream/30 text-cream backdrop-blur-sm transition-colors hover:border-cream hover:bg-cream hover:text-obsidian"
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5" strokeWidth={1.6} />
              ) : (
                <Volume2 className="h-3.5 w-3.5" strokeWidth={1.6} />
              )}
            </button>
          </div>
        )}

        {/* Chapter indicators — navigable whether the reel is running video
            or stills. */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Hero reel">
          {HERO_CLIPS.map((entry, entryIndex) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={entryIndex === index}
              aria-label={entry.label}
              onClick={() => select(entryIndex)}
              className="group relative h-6 w-9 sm:w-12"
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cream/35 transition-colors group-hover:bg-cream/60" />
              {entryIndex === index && (
                <motion.span
                  layoutId="hero-reel-indicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cream"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
