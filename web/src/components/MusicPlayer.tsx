import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MusicConfig } from '../types'

const storageKey = 'sync_loading_horizon_volume_v1'
const formatTime = (value: number) => Number.isFinite(value) ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}` : '0:00'

export function MusicPlayer({ config, completing }: { config: MusicConfig; completing: boolean }) {
  const audio = useRef<HTMLAudioElement>(null)
  const collapseTimer = useRef<number | undefined>(undefined)
  const playControl = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(config.mode === 'expanded')
  const [failed, setFailed] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [coverErr, setCoverErr] = useState(false)
  const [volume, setVolume] = useState(() => {
    if (!config.rememberVolume) return config.volume
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return config.volume
    const saved = Number(raw)
    return Number.isFinite(saved) ? Math.min(1, Math.max(0, saved)) : config.volume
  })
  const track = config.tracks[trackIndex]

  const play = useCallback(async () => {
    if (!audio.current) return
    try {
      audio.current.muted = false
      audio.current.volume = volume
      await audio.current.play()
      setPlaying(true)
      setFailed(false)
    } catch {
      setPlaying(false)
    }
  }, [volume])

  const next = useCallback(() => {
    setCoverErr(false)
    setTrackIndex(index => config.shuffle ? Math.floor(Math.random() * config.tracks.length) : (index + 1) % config.tracks.length)
  }, [config.shuffle, config.tracks.length])

  const previous = () => {
    setCoverErr(false)
    setTrackIndex(index => (index - 1 + config.tracks.length) % config.tracks.length)
  }

  const scheduleCollapse = () => {
    if (config.mode !== 'auto') return
    window.clearTimeout(collapseTimer.current)
    collapseTimer.current = window.setTimeout(() => setExpanded(false), config.collapseAfter)
  }

  const handleAudioError = useCallback(() => {
    if (config.tracks.length > 1) {
      setCoverErr(false)
      setTrackIndex(index => (index + 1) % config.tracks.length)
    } else {
      setFailed(true)
    }
  }, [config.tracks.length])

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume
      audio.current.muted = false
    }
    if (config.rememberVolume) {
      localStorage.setItem(storageKey, String(volume))
    }
  }, [config.rememberVolume, volume])

  useEffect(() => {
    if (!config.autoplay || !track) return

    // Attempt direct autoplay
    void play()

    // Unlock on any user interaction in FiveM CEF
    const unlock = () => {
      if (audio.current && audio.current.paused) {
        void play()
      }
    }

    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('click', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true, passive: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [config.autoplay, play, track])

  useEffect(() => { if (completing) { setExpanded(false); audio.current?.pause() } }, [completing])
  useEffect(() => { if (expanded && restoreFocus.current) { restoreFocus.current = false; playControl.current?.focus() } }, [expanded])
  useEffect(() => () => window.clearTimeout(collapseTimer.current), [])

  if (!config.enabled || !track || failed) return null
  const compact = config.mode === 'compact' || (config.mode === 'auto' && !expanded)
  const finish = () => {
    if (config.repeatMode === 'one') { if (audio.current) { audio.current.currentTime = 0; void play() } }
    else if (config.repeatMode === 'all' || trackIndex < config.tracks.length - 1) next()
    else setPlaying(false)
  }

  const hasCover = Boolean(track.coverArt) && !coverErr
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <section
      className={`music-player ${compact ? 'is-compact' : 'is-expanded'}`}
      onMouseEnter={() => { if (config.mode === 'auto') setExpanded(true); window.clearTimeout(collapseTimer.current) }}
      onMouseLeave={scheduleCollapse}
      onFocusCapture={() => { if (config.mode === 'auto' && !expanded) { restoreFocus.current = true; setExpanded(true) } window.clearTimeout(collapseTimer.current) }}
      onBlurCapture={scheduleCollapse}
      aria-label="Music player"
    >
      <audio
        ref={audio}
        src={track.file}
        autoPlay={config.autoplay}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={event => setDuration(event.currentTarget.duration)}
        onEnded={finish}
        onError={handleAudioError}
      />

      <div className="mp-primary">
        <div key={`cover-${track.file}`} className={`mp-cover ${hasCover ? 'has-art' : ''} ${playing ? 'is-playing' : ''}`}>
          {hasCover
            ? <img src={track.coverArt} alt={track.title} onError={() => setCoverErr(true)} />
            : <span className="mp-cover-bars"><i /><i /><i /><i /></span>
          }
          {hasCover && playing && <span className="mp-cover-status" aria-hidden="true"><i /><i /><i /></span>}
        </div>

        <div key={`info-${track.file}`} className="mp-info">
          <div className="mp-title-row">
            <b className="mp-title" title={track.title}>{track.title}</b>
            {config.tracks.length > 1 && <span className="mp-track-index">{String(trackIndex + 1).padStart(2, '0')} / {String(config.tracks.length).padStart(2, '0')}</span>}
          </div>
          <small className="mp-artist">{track.artist}</small>
        </div>

        <button ref={playControl} type="button" className="mp-btn mp-play-primary" onClick={() => playing ? audio.current?.pause() : void play()} aria-label={playing ? 'Pause music' : 'Play music'}>
          {playing ? <Pause /> : <Play />}
        </button>
      </div>

      {compact && <div className="mp-compact-progress" aria-hidden="true"><span style={{ width: `${progressPct}%` }} /></div>}

      {!compact && <div className="mp-detail">
        <div className="mp-progress">
          <div className="mp-progress-rail">
            <div className="mp-progress-fill" style={{ width: `${progressPct}%` }} />
            <input type="range" min={0} max={duration || 1} value={currentTime} step={0.1} onChange={event => { if (audio.current) audio.current.currentTime = Number(event.target.value) }} aria-label="Track position" />
          </div>
          <div className="mp-times">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mp-detail-controls">
          <div className="mp-mode-group" aria-label="Playback modes">
            <span className={`mp-mode ${config.shuffle ? 'is-on' : ''}`} title={config.shuffle ? 'Shuffle on' : 'Shuffle off'}><Shuffle /></span>
            <span className={`mp-mode ${config.repeatMode !== 'off' ? 'is-on' : ''}`} title={`Repeat ${config.repeatMode}`}><Repeat /></span>
          </div>
          <div className="mp-skip-group">
            <button type="button" className="mp-btn" onClick={previous} aria-label="Previous track"><SkipBack /></button>
            <button type="button" className="mp-btn" onClick={next} aria-label="Next track"><SkipForward /></button>
          </div>
          <div className="mp-volume">
            <span className="mp-vol-icon">{volume === 0 ? <VolumeX /> : volume < .5 ? <Volume1 /> : <Volume2 />}</span>
            <div className="mp-volume-rail">
              <div className="mp-volume-fill" style={{ width: `${volume * 100}%` }} />
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="Music volume" />
            </div>
          </div>
        </div>
      </div>}
    </section>
  )
}
