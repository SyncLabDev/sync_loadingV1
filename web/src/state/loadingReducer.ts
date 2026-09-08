import { defaultConfig } from '../config/defaults'
import type { LoadingAction, LoadingState, Milestone } from '../types'

const fallbackThresholds = [0, 0.08, 0.32, 0.68, 0.9]
const milestoneStage: Partial<Record<Milestone, number>> = {
  identity: 1, 'assets-start': 2, 'assets-end': 3, 'interface-start': 3, 'interface-end': 4, session: 4,
}

export function initialLoadingState(now = Date.now()): LoadingState {
  return { config: defaultConfig, progress: 0, phase: 'loading', stageIndex: 0, milestones: new Set(), chapterIndex: 0, momentIndex: 0, startedAt: now, samples: [] }
}

function stageForProgress(progress: number, stageCount: number) {
  let index = 0
  for (let candidate = 0; candidate < Math.min(stageCount, fallbackThresholds.length); candidate += 1) {
    if (progress >= fallbackThresholds[candidate]) index = candidate
  }
  return Math.min(Math.max(0, stageCount - 1), index)
}

function pushSample(samples: LoadingState['samples'], progress: number, time: number) {
  const next = [...samples, { time, progress }].filter(sample => time - sample.time <= 30000)
  return next.slice(-20)
}

export function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (action.type) {
    case 'CONFIG':
      return { ...state, config: action.config, playerCount: action.playerCount ?? state.playerCount, stageIndex: Math.min(action.config.Stages.length - 1, Math.max(state.stageIndex, 1)), milestones: new Set([...state.milestones, 'identity']) }
    case 'PROGRESS': { 
      if (!Number.isFinite(action.progress)) return state
      const progress = Math.max(state.progress, Math.min(1, Math.max(0, action.progress)))
      const nextStage = Math.max(state.stageIndex, stageForProgress(progress, state.config.Stages.length))
      return { ...state, progress, stageIndex: nextStage, samples: pushSample(state.samples, progress, action.time ?? Date.now()) }
    }
    case 'MILESTONE': {
      const milestones = new Set(state.milestones); milestones.add(action.milestone)
      const mapped = milestoneStage[action.milestone] ?? 0
      return { ...state, milestones, stageIndex: Math.min(state.config.Stages.length - 1, Math.max(state.stageIndex, mapped)) }
    }
    case 'SET_CHAPTER':
      return { ...state, chapterIndex: Math.max(0, Math.min(state.config.Cinematics.chapters.length - 1, action.index)) }
    case 'NEXT_CHAPTER':
      return { ...state, chapterIndex: state.config.Cinematics.chapters.length ? (state.chapterIndex + 1) % state.config.Cinematics.chapters.length : 0 }
    case 'NEXT_MOMENT':
      return { ...state, momentIndex: state.config.Moments.items.length ? (state.momentIndex + 1) % state.config.Moments.items.length : 0 }
    case 'SET_STAGE':
      return { ...state, stageIndex: Math.max(state.stageIndex, Math.min(state.config.Stages.length - 1, Math.max(0, action.index))) }
    case 'SET_PERFORMANCE':
      return { ...state, config: { ...state.config, Performance: { mode: action.mode } } }
    case 'COMPLETE':
      return { ...state, progress: 1, stageIndex: state.config.Stages.length - 1, phase: 'completing', samples: pushSample(state.samples, 1, Date.now()) }
    case 'RESET':
      return { ...initialLoadingState(), config: state.config, playerCount: state.playerCount }
    default:
      return state
  }
}

export function estimateRemaining(state: LoadingState, now = Date.now()): number | undefined {
  if (!state.config.Progress.showETA || state.progress <= 0 || state.progress >= 1 || state.samples.length < 3) return undefined
  const first = state.samples[0]; const last = state.samples.at(-1)!
  const elapsed = last.time - first.time; const gained = last.progress - first.progress
  if (elapsed < 4000 || gained < 0.01 || now - last.time > 5000) return undefined
  const rate = gained / elapsed
  const remaining = (1 - state.progress) / rate
  return Number.isFinite(remaining) && remaining >= 0 && remaining <= 30 * 60 * 1000 ? remaining : undefined
}
