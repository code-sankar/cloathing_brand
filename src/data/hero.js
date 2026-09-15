/**
 * Hero reel.
 *
 * Each entry pairs a poster still with a list of video sources. The poster is
 * painted immediately; the video fades in over it only once it is actually
 * playing frames, so the hero is never blank and never flashes black.
 *
 * `sources` is tried in order by the browser's media-resource selection, so a
 * URL that 404s falls through to the next one. The last entry is a local file
 * committed to `public/videos/`, which means the reel always has something to
 * play even with no network.
 *
 * To use your own footage: drop files into `public/videos/` and reference them
 * as `/videos/<name>.mp4`, or point `src` at any CDN URL. Keep clips short,
 * muted-friendly and under ~3 MB — they autoplay on first paint.
 */

// WebM first so Chrome and Firefox take the smaller file; Safari skips the
// type it can't decode and lands on the H.264 MP4.
const LOCAL_DRAPE = [
  { src: '/videos/atelier-drape.webm', type: 'video/webm' },
  { src: '/videos/atelier-drape.mp4', type: 'video/mp4' },
]

export const HERO_CLIPS = [
  {
    id: 'reel-01',
    label: 'The Overcoat',
    poster: 'photo-1490481651871-ab68de25d43d',
    alt: 'Model wearing the Autumn Volume 04 overcoat',
    sources: [
      {
        src: 'https://videos.pexels.com/video-files/7671960/7671960-uhd_2560_1440_25fps.mp4',
        type: 'video/mp4',
      },
      ...LOCAL_DRAPE,
    ],
  },
  {
    id: 'reel-02',
    label: 'In the Atelier',
    poster: 'photo-1441984904996-e0b6ba687e04',
    alt: 'Garments on a rail inside the atelier',
    sources: [
      {
        src: 'https://videos.pexels.com/video-files/6068951/6068951-hd_1920_1080_25fps.mp4',
        type: 'video/mp4',
      },
      ...LOCAL_DRAPE,
    ],
  },
  {
    id: 'reel-03',
    label: 'Volume 04',
    poster: 'photo-1469334031218-e382a71b716b',
    alt: 'Two models in Volume 04 outerwear',
    sources: [
      {
        src: 'https://videos.pexels.com/video-files/5865064/5865064-hd_1920_1080_30fps.mp4',
        type: 'video/mp4',
      },
      ...LOCAL_DRAPE,
    ],
  },
]

/** How long a poster stays up when video can't play (reduced motion, save-data). */
export const POSTER_INTERVAL_MS = 6500
