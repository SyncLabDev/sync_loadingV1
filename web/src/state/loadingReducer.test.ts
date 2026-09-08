import { describe, expect, it } from 'vitest'
import { defaultConfig } from '../config/defaults'
import { estimateRemaining, initialLoadingState, loadingReducer } from './loadingReducer'

describe('loadingReducer', () => {
  it('never regresses progress or stages', () => {
    let state = loadingReducer(initialLoadingState(0), { type: 'PROGRESS', progress: .72, time: 1000 })
    state = loadingReducer(state, { type: 'PROGRESS', progress: .2, time: 2000 })
    expect(state.progress).toBe(.72)
    expect(state.stageIndex).toBe(3)
  })

  it('maps real milestones monotonically', () => {
    let state = loadingReducer(initialLoadingState(), { type: 'MILESTONE', milestone: 'interface-start' })
    state = loadingReducer(state, { type: 'MILESTONE', milestone: 'assets-start' })
    expect(state.stageIndex).toBe(3)
  })

  it('treats configuration hydration as the identity milestone', () => {
    const state = loadingReducer(initialLoadingState(), { type: 'CONFIG', config: defaultConfig })
    expect(state.stageIndex).toBe(1)
    expect(state.milestones.has('identity')).toBe(true)
  })

  it('completes every stage and reaches one', () => {
    const state = loadingReducer(initialLoadingState(), { type: 'COMPLETE' })
    expect(state.phase).toBe('completing')
    expect(state.progress).toBe(1)
    expect(state.stageIndex).toBe(defaultConfig.Stages.length - 1)
  })

  it('only exposes a stable ETA', () => {
    const base = initialLoadingState(0)
    const config = { ...base.config, Progress: { ...base.config.Progress, showETA: true } }
    const state = { ...base, config, progress: .5, samples: [{ time: 0, progress: .1 }, { time: 3000, progress: .25 }, { time: 6000, progress: .5 }] }
    expect(estimateRemaining(state, 6000)).toBeGreaterThan(0)
    expect(estimateRemaining({ ...state, samples: state.samples.slice(0, 2) }, 6000)).toBeUndefined()
  })
})
