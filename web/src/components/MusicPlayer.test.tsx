import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultConfig } from '../config/defaults'
import type { MusicConfig } from '../types'
import { MusicPlayer } from './MusicPlayer'

const tracks: MusicConfig['tracks'] = [
  { title: 'TRACK ONE', artist: 'TEST ARTIST', file: 'assets/audio/track-one.mp3', coverArt: 'assets/audio/track-one.jpg' },
  { title: 'TRACK TWO', artist: 'TEST ARTIST', file: 'assets/audio/track-two.mp3', coverArt: 'assets/audio/track-two.jpg' },
]

const musicConfig = (overrides: Partial<MusicConfig> = {}): MusicConfig => ({
  ...defaultConfig.Music,
  autoplay: false,
  rememberVolume: false,
  tracks,
  ...overrides,
})

describe('MusicPlayer', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: vi.fn().mockResolvedValue(undefined) })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: vi.fn() })
  })

  afterEach(cleanup)

  it('keeps one primary play control in compact and expanded modes', () => {
    const compact = render(<MusicPlayer config={musicConfig({ mode: 'compact' })} completing={false} />)
    expect(compact.container.querySelector('.music-player')).toHaveClass('is-compact')
    expect(screen.getAllByLabelText('Play music')).toHaveLength(1)
    expect(compact.container.querySelector('.mp-compact-progress')).toBeInTheDocument()
    compact.unmount()

    const expanded = render(<MusicPlayer config={musicConfig({ mode: 'expanded' })} completing={false} />)
    expect(expanded.container.querySelector('.music-player')).toHaveClass('is-expanded')
    expect(screen.getAllByLabelText('Play music')).toHaveLength(1)
    expect(expanded.container.querySelector('.mp-detail')).toBeInTheDocument()
  })

  it('shows playback position in the compact card', () => {
    const { container } = render(<MusicPlayer config={musicConfig({ mode: 'compact' })} completing={false} />)
    const audio = container.querySelector('audio')!
    Object.defineProperty(audio, 'duration', { configurable: true, value: 100 })
    Object.defineProperty(audio, 'currentTime', { configurable: true, value: 25, writable: true })
    fireEvent.durationChange(audio)
    fireEvent.timeUpdate(audio)
    expect(container.querySelector('.mp-compact-progress span')).toHaveStyle({ width: '25%' })
  })

  it('updates the complete track identity with next and previous controls', () => {
    render(<MusicPlayer config={musicConfig({ mode: 'expanded' })} completing={false} />)
    fireEvent.click(screen.getByLabelText('Next track'))
    expect(screen.getByText('TRACK TWO')).toBeInTheDocument()
    expect(screen.getAllByText('TEST ARTIST').length).toBeGreaterThan(0)
    expect(screen.getByText('02 / 02')).toBeInTheDocument()
    expect(screen.getByAltText('TRACK TWO')).toHaveAttribute('src', 'assets/audio/track-two.jpg')

    fireEvent.click(screen.getByLabelText('Previous track'))
    expect(screen.getByText('TRACK ONE')).toBeInTheDocument()
    expect(screen.getByText('01 / 02')).toBeInTheDocument()
  })

  it('expands around the same focused play control in auto mode', () => {
    const { container } = render(<MusicPlayer config={musicConfig({ mode: 'auto' })} completing={false} />)
    const play = screen.getByLabelText('Play music')
    fireEvent.focus(play)
    expect(container.querySelector('.music-player')).toHaveClass('is-expanded')
    expect(screen.getAllByLabelText('Play music')).toHaveLength(1)
    expect(play).toHaveFocus()
  })
})
