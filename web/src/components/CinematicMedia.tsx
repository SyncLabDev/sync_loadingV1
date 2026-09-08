import { useEffect, useMemo, useState } from 'react'
import type { CinematicChapter, HorizonConfig } from '../types'

interface Props { config: HorizonConfig; chapterIndex: number; forcedFailure?: boolean }

function MediaLayer({ chapter, fallback, performance, forcedFailure }: { chapter: CinematicChapter; fallback?: string; performance: HorizonConfig['Performance']['mode']; forcedFailure: boolean }) {
  const [videoFailed, setVideoFailed] = useState(forcedFailure)
  const [imageFailed, setImageFailed] = useState(forcedFailure)
  useEffect(() => { setVideoFailed(forcedFailure); setImageFailed(forcedFailure) }, [chapter.id, forcedFailure])
  const useVideo = chapter.type === 'video' && performance !== 'low' && !videoFailed
  const source = useVideo ? chapter.media : (chapter.type === 'image' ? chapter.media : chapter.fallback ?? fallback)

  if (!source || imageFailed) return <div className="media-gradient" aria-hidden="true" />
  if (useVideo) {
    return <div className="media-video-stack">
      {chapter.fallback && <img className="media-asset media-video-fallback" src={chapter.fallback} alt="" draggable={false} onError={() => setImageFailed(true)} />}
      <video className="media-asset media-video" src={source} autoPlay muted loop playsInline preload={performance === 'high' ? 'auto' : 'metadata'} onError={() => setVideoFailed(true)} />
    </div>
  }
  return <img className="media-asset" src={source} alt="" draggable={false} onError={() => setImageFailed(true)} />
}

export function CinematicMedia({ config, chapterIndex, forcedFailure = false }: Props) {
  const useChapters = config.Cinematics.enabled && ['chapters', 'slideshow'].includes(config.Media.type)
  const chapters = useChapters ? config.Cinematics.chapters : []
  const fallbackChapter = useMemo<CinematicChapter>(() => ({
    id: 'primary', label: 'WORLD', type: config.Media.type === 'video' ? 'video' : 'image',
    media: config.Media.type === 'gradient' ? '' : config.Media.source ?? '', fallback: config.Media.fallback, focalPoint: config.Media.focalPoint, duration: 10000,
  }), [config.Media])
  const chapter = chapters[chapterIndex] ?? fallbackChapter
  const [visible, setVisible] = useState(chapter)
  const [previous, setPrevious] = useState<CinematicChapter>()

  useEffect(() => {
    if (chapter === visible) return
    setPrevious(visible); setVisible(chapter)
    const timer = window.setTimeout(() => setPrevious(undefined), config.Cinematics.transitionDuration + 80)
    return () => window.clearTimeout(timer)
  }, [chapter, config.Cinematics.transitionDuration, visible])

  const layer = (item: CinematicChapter, active: boolean) => (
    <div
      key={item.id}
      className={`media-layer focal-${item.focalPoint} ${active ? 'is-active' : 'is-leaving'} transition-${config.Cinematics.transition}`}
      style={{ '--media-transition': `${config.Cinematics.transitionDuration}ms` } as React.CSSProperties}
    >
      <MediaLayer chapter={item} fallback={config.Media.fallback} performance={config.Performance.mode} forcedFailure={forcedFailure} />
    </div>
  )

  return <div className={`cinematic-media performance-${config.Performance.mode} ${config.Media.ambientZoom ? 'has-ambient-zoom' : ''}`}>
    <div className="brand-gradient" />
    {previous && layer(previous, false)}
    {layer(visible, true)}
    <div className="cinematic-grade" style={{ '--media-overlay': config.Media.overlay } as React.CSSProperties} />
    <div className="film-grain" />
  </div>
}
