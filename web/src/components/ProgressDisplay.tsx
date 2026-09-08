import { estimateRemaining } from '../state/loadingReducer'
import type { LoadingState } from '../types'

const eta = (milliseconds: number) => {
  const total = Math.ceil(milliseconds / 1000)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function ProgressDisplay({ state }: { state: LoadingState }) {
  const { style, showPercentage, showCheckpoints } = state.config.Progress
  if (style === 'hidden' || style === 'stage_only') return null
  const percentage = Math.round(state.progress * 100)
  const remaining = estimateRemaining(state)
  const active = state.config.Stages[state.stageIndex]

  return <section className={`progress-display progress-${style}`} aria-label={`Loading ${percentage} percent`}>
    <div className="progress-copy">
      {showPercentage && <strong>{percentage}<small>%</small></strong>}
      <div><span>{state.phase === 'completing' ? 'ENTERING CITY' : active?.activeMessage.toUpperCase()}</span>{remaining !== undefined && <small>ESTIMATED / {eta(remaining)}</small>}</div>
    </div>
    {!['percentage'].includes(style) && <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
      <span style={{ width: `${percentage}%` }} />
      {showCheckpoints && <div className="progress-checkpoints">{[20, 40, 60, 80].map(mark => <i key={mark} style={{ left: `${mark}%` }} />)}</div>}
    </div>}
  </section>
}
