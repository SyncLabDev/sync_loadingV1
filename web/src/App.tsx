import { useMemo, useState } from 'react'
import { CinematicMedia } from './components/CinematicMedia'
import { HorizonWedge } from './components/HorizonWedge'
import { MusicPlayer } from './components/MusicPlayer'
import { ProgressDisplay } from './components/ProgressDisplay'
import { ServerMeta } from './components/ServerMeta'
import { ScrambleText } from './components/ScrambleText'
import { DevController } from './dev/DevController'
import { useLoadingEngine } from './hooks/useLoadingEngine'
import { isEnvBrowser } from './lib/environment'
import type { LoadingStage } from './types'

export default function App() {
  const { state, dispatch } = useLoadingEngine()
  const [mediaFailure, setMediaFailure] = useState(false)
  const { config } = state
  const stages = useMemo<LoadingStage[]>(() => config.Stages.map((stage, index) => ({ ...stage, status: index < state.stageIndex ? 'complete' : index === state.stageIndex ? 'active' : 'pending' })), [config.Stages, state.stageIndex])
  const chapter = config.Cinematics.chapters[state.chapterIndex]
  const moment = config.Moments.items[state.momentIndex]
  const style = {
    '--sync-accent': config.Brand.accent,
    '--safe-x': `${config.Layout.safeHorizontal}vw`,
    '--safe-y': `${config.Layout.safeVertical}vh`,
    '--intro-duration': `${config.Motion.introDuration}ms`,
    '--completion-duration': `${config.Motion.completionDuration}ms`,
    '--sync-ease': config.Motion.easing,
  } as React.CSSProperties

  return <main className={`horizon-root side-${config.Layout.wedgeSide} wedge-${config.Layout.wedgeWidth} phase-${state.phase}`} style={style}>
    <CinematicMedia config={config} chapterIndex={state.chapterIndex} forcedFailure={mediaFailure} />
    <div className="completion-veil" aria-hidden="true" />
    <div className="top-micro"><span>SYNC / 02 — HORIZON</span><span>{config.Server.name}</span></div>
    <HorizonWedge config={config} stages={stages} moment={moment} momentIndex={state.momentIndex} chapterLabel={chapter?.label} phase={state.phase} />
    <MusicPlayer config={config.Music} completing={state.phase === 'completing'} />
    <ProgressDisplay state={state} />
    <ServerMeta config={config} playerCount={state.playerCount} />
    <div className="completion-copy" role="status" aria-live="assertive">
      <span>ENTERING CITY</span>
      <strong><ScrambleText text="SYNC ESTABLISHED" triggerKey={state.phase} duration={720} delay={360} enabled={config.Performance.mode !== 'low'} intensity="hero" /></strong>
      <i aria-hidden="true" />
    </div>
    {import.meta.env.DEV && isEnvBrowser && <DevController state={state} dispatch={dispatch} mediaFailure={mediaFailure} setMediaFailure={setMediaFailure} />}
  </main>
}
