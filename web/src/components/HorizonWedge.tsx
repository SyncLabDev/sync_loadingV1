import type { HorizonConfig, LoadingStage, MomentConfig } from '../types'
import { ScrambleText } from './ScrambleText'

interface Props {
  config: HorizonConfig
  stages: LoadingStage[]
  moment?: MomentConfig
  momentIndex: number
  chapterLabel?: string
  phase: 'loading' | 'completing'
}

export function HorizonWedge({ config, stages, moment, momentIndex, chapterLabel, phase }: Props) {
  const active = stages.find(stage => stage.status === 'active') ?? stages.at(-1)
  const stateTitle = phase === 'completing' ? ['SYNC', 'ESTABLISHED'] : active?.id === 'session' ? ['FINALIZING', 'SESSION'] : active?.id === 'world' ? ['ESTABLISHING', 'SYNC'] : ['SYNCHRONIZING', 'SERVER DATA']
  const scrambleEnabled = config.Performance.mode !== 'low'

  return <aside className="horizon-wedge" aria-label="Server loading status">
    <div className="wedge-surface" />
    <div className="wedge-seam" aria-hidden="true" />
    <div className="wedge-content">
      <div className="brand-lockup intro-item item-logo">
        {config.Brand.logo
          ? <div className="brand-mark">
              <img
                className="brand-mark-img"
                src={config.Brand.logo}
                alt={`${config.Server.name} logo`}
                onError={event => { event.currentTarget.closest('.brand-mark')?.classList.add('mark-failed') }}
              />
              <div className="brand-mark-text">
                <strong>{config.Server.name.split(' ')[0]}</strong>
                <span>{config.Server.name.split(' ').slice(1).join(' ') || config.Server.shortName}</span>
              </div>
            </div>
          : <div className="brand-fallback"><strong>SYNC</strong><span>HORIZON</span></div>
        }
      </div>

      <header className="state-heading intro-item item-state">
        <p>{config.Server.shortName} / CONNECTION</p>
        <h1>
          <span><ScrambleText text={stateTitle[0]} triggerKey={stateTitle[0]} duration={560} delay={120} enabled={scrambleEnabled} /></span>
          <strong><ScrambleText text={stateTitle[1]} triggerKey={stateTitle[1]} duration={620} delay={170} enabled={scrambleEnabled} /></strong>
        </h1>
        <small><ScrambleText text={active?.activeMessage ?? 'Preparing session'} triggerKey={active?.id ?? phase} duration={300} enabled={scrambleEnabled} className="scramble-stage-message" /></small>
      </header>

      <ol className="stage-rail intro-item item-stages">
        {stages.map((stage, index) => <li key={stage.id} className={`stage-${stage.status}`} aria-current={stage.status === 'active' ? 'step' : undefined} aria-label={`${stage.label}: ${stage.status}`}>
          <span className="stage-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="stage-copy">
            <b>{stage.label}</b>
            {stage.status === 'active' && <small>{stage.activeMessage}</small>}
          </span>
          {stage.status === 'complete' && (
            <span className="stage-check" aria-hidden="true">
              <i className="stage-check-pip" />
            </span>
          )}
        </li>)}
      </ol>

      <div className="wedge-bottom intro-item item-context">
        <div className="context-panel">
          {config.Moments.enabled && moment && <section className="sync-moment" aria-live="polite">
            <div className="moment-head">
              <span>SYNC MOMENT</span>
              <span className="moment-sequence" aria-label={`Moment ${momentIndex + 1} of ${config.Moments.items.length}`}>
                {config.Moments.items.map((item, index) => <i key={`${item.title}-${index}`} className={index === momentIndex ? 'is-current' : undefined} />)}
              </span>
            </div>
            <div className="moment-copy" key={momentIndex}>
              <b>{moment.title}</b>
              <p>{moment.text}</p>
            </div>
          </section>}
          <div className="location-row">
            {config.Location.enabled && <div className="location-copy"><small>ARRIVAL POINT</small><b>{config.Location.title}</b><span>{config.Location.subtitle}</span></div>}
            {chapterLabel && <small className="scene-code"><span>LIVE SCENE</span><b><i />{chapterLabel}</b></small>}
          </div>
        </div>
      </div>
    </div>
  </aside>
}
