import { describe, expect, it } from 'vitest'
import { normalizeConfig } from './normalize'

describe('normalizeConfig', () => {
  it('uses safe defaults for malformed input', () => {
    const result = normalizeConfig({ Brand: { accent: 'red' }, Media: { overlay: 9, source: '../secret' }, Music: { volume: -2 } })
    expect(result.Brand.accent).toBe('#6BBFFF')
    expect(result.Media.overlay).toBe(.85)
    expect(result.Media.source).toBe('assets/media/horizon-boulevard.webp')
    expect(result.Music.volume).toBe(0)
  })

  it('filters unsafe links and invalid media paths', () => {
    const result = normalizeConfig({
      Socials: [{ label: 'bad', url: 'javascript:alert(1)' }, { label: 'good', url: 'https://sync.example' }],
      Cinematics: { chapters: [{ id: 'bad', media: '../../secret' }, { id: 'city', media: 'assets/city.webp' }] },
    })
    expect(result.Socials).toHaveLength(1)
    expect(result.Socials[0].label).toBe('good')
    expect(result.Cinematics.chapters).toHaveLength(1)
  })

  it('keeps safe music cover art and removes unsafe cover paths', () => {
    const result = normalizeConfig({
      Music: {
        tracks: [
          { title: 'Safe', artist: 'Artist', file: 'assets/audio/safe.mp3', coverArt: 'assets/audio/safe.jpg' },
          { title: 'Unsafe cover', artist: 'Artist', file: 'assets/audio/other.mp3', coverArt: '../../secret.jpg' },
        ],
      },
    })

    expect(result.Music.tracks[0].coverArt).toBe('assets/audio/safe.jpg')
    expect(result.Music.tracks[1].coverArt).toBeUndefined()
  })

  it('clamps durations, counts, and user values', () => {
    const result = normalizeConfig({ Motion: { completionDuration: 9000 }, Moments: { interval: 10 }, Layout: { safeHorizontal: 99 } })
    expect(result.Motion.completionDuration).toBe(3000)
    expect(result.Moments.interval).toBe(2500)
    expect(result.Layout.safeHorizontal).toBe(8)
  })
})
