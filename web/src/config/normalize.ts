import { defaultConfig } from './defaults'
import type { CinematicChapter, FocalPoint, HorizonConfig, MediaType, MomentConfig, MusicTrack, PerformanceMode, ProgressStyle, RepeatMode, SocialLink, TransitionMode, WedgeSide, WedgeWidth } from '../types'

type RecordValue = Record<string, unknown>
const object = (value: unknown): RecordValue => value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {}
const stripControls = (value: string) => Array.from(value).filter(character => character.charCodeAt(0) >= 32).join('')
const text = (value: unknown, fallback: string, max = 160) => typeof value === 'string' && value.trim() ? Array.from(stripControls(value)).slice(0, max).join('') : fallback
const optionalText = (value: unknown, max = 240) => typeof value === 'string' && value.trim() ? Array.from(stripControls(value)).slice(0, max).join('') : undefined
const number = (value: unknown, min: number, max: number, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback
const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const oneOf = <T extends string>(value: unknown, values: readonly T[], fallback: T): T => values.includes(value as T) ? value as T : fallback
const path = (value: unknown, fallback?: string) => {
  const candidate = optionalText(value, 260)
  if (!candidate || candidate.includes('..') || /^(?:javascript|data):/i.test(candidate)) return fallback
  return candidate.replace(/^\/+/, '')
}
const color = (value: unknown, fallback: string) => typeof value === 'string' && /^(#[\da-f]{6}|#[\da-f]{3})$/i.test(value) ? value : fallback
const safeUrl = (value: unknown) => {
  if (typeof value !== 'string') return undefined
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.toString() : undefined } catch { return undefined }
}

const focalValues: FocalPoint[] = ['left', 'center', 'right', 'top', 'bottom']

function chapters(value: unknown): CinematicChapter[] {
  if (!Array.isArray(value)) return defaultConfig.Cinematics.chapters
  const normalized = value.slice(0, 12).flatMap((entry, index) => {
    const item = object(entry); const media = path(item.media)
    if (!media) return []
    return [{
      id: text(item.id, `chapter-${index + 1}`, 48), label: text(item.label, `CHAPTER ${index + 1}`, 48),
      subtitle: optionalText(item.subtitle, 120), type: oneOf(item.type, ['video', 'image'] as const, 'image'),
      media, fallback: path(item.fallback), focalPoint: oneOf(item.focalPoint, focalValues, 'center'),
      duration: number(item.duration, 2000, 60000, 9000),
    } satisfies CinematicChapter]
  })
  return normalized.length ? normalized : defaultConfig.Cinematics.chapters
}

function moments(value: unknown): MomentConfig[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 30).flatMap(entry => {
    const item = object(entry); const body = optionalText(item.text, 220)
    return body ? [{ category: text(item.category, 'custom', 32), title: text(item.title, 'MOMENT', 64), text: body }] : []
  })
}

function tracks(value: unknown): MusicTrack[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 30).flatMap(entry => {
    const item = object(entry); const file = path(item.file)
    if (!file) return []
    const coverArt = path(item.coverArt)
    return [{
      title: text(item.title, 'Untitled', 80),
      artist: text(item.artist, 'SYNC Radio', 80),
      file,
      ...(coverArt ? { coverArt } : {}),
    }]
  })
}

function socials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 8).flatMap(entry => {
    const item = object(entry); const url = safeUrl(item.url)
    return url ? [{ label: text(item.label, 'LINK', 24), url }] : []
  })
}

export function normalizeConfig(value: unknown): HorizonConfig {
  const root = object(value)
  const server = object(root.Server); const brand = object(root.Brand); const layout = object(root.Layout)
  const media = object(root.Media); const cinematics = object(root.Cinematics); const progress = object(root.Progress)
  const momentsConfig = object(root.Moments); const music = object(root.Music); const location = object(root.Location)
  const performance = object(root.Performance); const motion = object(root.Motion); const lifecycle = object(root.Lifecycle); const debug = object(root.Debug)
  const stageInput = Array.isArray(root.Stages) ? root.Stages : defaultConfig.Stages
  const stageList = stageInput.slice(0, 8).map((entry, index) => {
    const item = object(entry); const fallback = defaultConfig.Stages[index] ?? defaultConfig.Stages.at(-1)!
    return { id: text(item.id, fallback.id, 32), label: text(item.label, fallback.label, 40), activeMessage: text(item.activeMessage, fallback.activeMessage, 100) }
  })

  return {
    Server: {
      name: text(server.name, defaultConfig.Server.name, 80), shortName: text(server.shortName, defaultConfig.Server.shortName, 28),
      tagline: text(server.tagline, defaultConfig.Server.tagline, 120), location: text(server.location, defaultConfig.Server.location, 60),
      build: text(server.build, defaultConfig.Server.build, 24), showPlayerCount: bool(server.showPlayerCount, defaultConfig.Server.showPlayerCount),
    },
    Brand: { logo: path(brand.logo, defaultConfig.Brand.logo), accent: color(brand.accent, defaultConfig.Brand.accent), showSyncLab: bool(brand.showSyncLab, true) },
    Layout: {
      wedgeSide: oneOf<WedgeSide>(layout.wedgeSide, ['left', 'right'], 'left'), wedgeWidth: oneOf<WedgeWidth>(layout.wedgeWidth, ['compact', 'standard', 'wide'], 'standard'),
      safeHorizontal: number(layout.safeHorizontal, 2, 8, 3.5), safeVertical: number(layout.safeVertical, 2, 8, 3.5),
    },
    Media: {
      type: oneOf<MediaType>(media.type, ['video', 'image', 'slideshow', 'chapters', 'gradient'], 'chapters'),
      source: path(media.source, defaultConfig.Media.source), fallback: path(media.fallback, defaultConfig.Media.fallback),
      focalPoint: oneOf(media.focalPoint, focalValues, 'center'), overlay: number(media.overlay, 0, 0.85, 0.3), ambientZoom: bool(media.ambientZoom, true),
    },
    Cinematics: {
      enabled: bool(cinematics.enabled, true), transition: oneOf<TransitionMode>(cinematics.transition, ['fade', 'mask_left', 'mask_right', 'soft_wipe', 'none'], 'soft_wipe'),
      transitionDuration: number(cinematics.transitionDuration, 0, 2500, 760), chapters: chapters(cinematics.chapters),
    },
    Stages: stageList.length ? stageList : defaultConfig.Stages,
    Progress: {
      style: oneOf<ProgressStyle>(progress.style, ['line', 'segmented', 'minimal', 'percentage', 'stage_only', 'hidden'], 'line'),
      showPercentage: bool(progress.showPercentage, true), showETA: bool(progress.showETA, false), showCheckpoints: bool(progress.showCheckpoints, true),
    },
    Moments: { enabled: bool(momentsConfig.enabled, true), interval: number(momentsConfig.interval, 2500, 60000, 8000), items: moments(momentsConfig.items) },
    Music: {
      enabled: bool(music.enabled, true), mode: oneOf(music.mode, ['expanded', 'compact', 'auto'] as const, 'auto'), autoplay: bool(music.autoplay, true),
      volume: number(music.volume, 0, 1, 0.22), rememberVolume: bool(music.rememberVolume, true), shuffle: bool(music.shuffle, false),
      repeatMode: oneOf<RepeatMode>(music.repeatMode, ['off', 'one', 'all'], 'all'), collapseAfter: number(music.collapseAfter, 1500, 30000, 5000), tracks: tracks(music.tracks),
    },
    Location: { enabled: bool(location.enabled, true), title: text(location.title, defaultConfig.Location.title, 60), subtitle: text(location.subtitle, defaultConfig.Location.subtitle, 100) },
    Socials: socials(root.Socials),
    Performance: { mode: oneOf<PerformanceMode>(performance.mode, ['high', 'balanced', 'low'], 'balanced') },
    Motion: { introDuration: number(motion.introDuration, 0, 3000, 1150), completionDuration: number(motion.completionDuration, 0, 3000, 1450), easing: text(motion.easing, defaultConfig.Motion.easing, 80) },
    Lifecycle: { autoShutdown: bool(lifecycle.autoShutdown, true), shutdownDelay: number(lifecycle.shutdownDelay, 0, 5000, 1700), failsafeDelay: number(lifecycle.failsafeDelay, 5000, 180000, 45000) },
    Debug: { printEvents: bool(debug.printEvents, false) },
  }
}
