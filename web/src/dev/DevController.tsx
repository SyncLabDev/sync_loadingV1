import type { Dispatch } from 'react'
import type { LoadingAction, LoadingState, PerformanceMode } from '../types'

export function DevController({ state, dispatch, mediaFailure, setMediaFailure }: { state: LoadingState; dispatch: Dispatch<LoadingAction>; mediaFailure: boolean; setMediaFailure: (value: boolean) => void }) {
  return <aside className="dev-controller" aria-label="Horizon development controller">
    <header><b>SYNC DEV</b><span>HORIZON</span></header>
    <label>Progress <output>{Math.round(state.progress * 100)}%</output><input type="range" min={0} max={100} value={Math.round(state.progress * 100)} onChange={event => dispatch({ type: 'PROGRESS', progress: Number(event.target.value) / 100 })} /></label>
    <label>Stage <select value={state.stageIndex} onChange={event => dispatch({ type: 'SET_STAGE', index: Number(event.target.value) })}>{state.config.Stages.map((stage, index) => <option key={stage.id} value={index}>{stage.label}</option>)}</select></label>
    <label>Chapter <select value={state.chapterIndex} onChange={event => dispatch({ type: 'SET_CHAPTER', index: Number(event.target.value) })}>{state.config.Cinematics.chapters.map((chapter, index) => <option key={chapter.id} value={index}>{chapter.label}</option>)}</select></label>
    <label>Performance <select value={state.config.Performance.mode} onChange={event => dispatch({ type: 'SET_PERFORMANCE', mode: event.target.value as PerformanceMode })}><option>high</option><option>balanced</option><option>low</option></select></label>
    <div className="dev-actions"><button type="button" onClick={() => dispatch({ type: 'NEXT_MOMENT' })}>Next moment</button><button type="button" onClick={() => setMediaFailure(!mediaFailure)}>{mediaFailure ? 'Restore media' : 'Fail media'}</button><button type="button" onClick={() => dispatch({ type: 'COMPLETE' })}>Complete</button><button type="button" onClick={() => dispatch({ type: 'RESET' })}>Reset</button></div>
  </aside>
}
