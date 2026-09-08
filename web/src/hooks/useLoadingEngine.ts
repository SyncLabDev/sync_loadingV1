import { useEffect, useMemo, useReducer, useState, type Dispatch } from 'react'
import { normalizeConfig } from '../config/normalize'
import { initialLoadingState, loadingReducer } from '../state/loadingReducer'
import type { LoadingAction, LoadingState, SyncLoadingEvent } from '../types'

const playerCount = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : undefined

const stageProgressFloors = [0.12, 0.32, 0.62, 0.85, 1.0]

export function useLoadingEngine() {
  const [rawState, dispatch] = useReducer(loadingReducer, undefined, () => {
    const base = initialLoadingState()
    const handover = window.nuiHandoverData
    if (!handover?.syncLoading) return base
    return loadingReducer(base, { type: 'CONFIG', config: normalizeConfig(handover.syncLoading), playerCount: playerCount(handover.playerCount) })
  })

  const [displayedStageIndex, setDisplayedStageIndex] = useState(0)
  const [displayedProgress, setDisplayedProgress] = useState(0)

  useEffect(() => {
    const listener = (event: MessageEvent<unknown>) => {
      if (!event.data || typeof event.data !== 'object') return
      const data = event.data as Record<string, unknown>
      if (rawState.config.Debug.printEvents) console.debug('[SYNC Loading]', data)
      switch (data.eventName) {
        case 'loadProgress':
          if (typeof data.loadFraction === 'number') dispatch({ type: 'PROGRESS', progress: data.loadFraction })
          break
        case 'startDataFileEntries': dispatch({ type: 'MILESTONE', milestone: 'assets-start' }); break
        case 'endDataFileEntries': dispatch({ type: 'MILESTONE', milestone: 'assets-end' }); break
        case 'startInitFunction': dispatch({ type: 'MILESTONE', milestone: 'interface-start' }); break
        case 'endInitFunction': dispatch({ type: 'MILESTONE', milestone: 'interface-end' }); break
        case 'sync_loading:config': {
          const syncEvent = data as unknown as SyncLoadingEvent
          if ('config' in syncEvent) dispatch({ type: 'CONFIG', config: normalizeConfig(syncEvent.config), playerCount: playerCount(syncEvent.playerCount) })
          break
        }
        case 'sync_loading:complete': dispatch({ type: 'COMPLETE' }); break
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [rawState.config.Debug.printEvents])

  useEffect(() => {
    const items = rawState.config.Moments.items
    if (!rawState.config.Moments.enabled || items.length < 2 || rawState.phase === 'completing') return
    const timer = window.setInterval(() => dispatch({ type: 'NEXT_MOMENT' }), rawState.config.Moments.interval)
    return () => window.clearInterval(timer)
  }, [rawState.config.Moments.enabled, rawState.config.Moments.interval, rawState.config.Moments.items, rawState.phase])

  useEffect(() => {
    const chapters = rawState.config.Cinematics.chapters
    if (!rawState.config.Cinematics.enabled || chapters.length < 2 || rawState.phase === 'completing') return
    const duration = chapters[rawState.chapterIndex]?.duration ?? 9000
    const timer = window.setTimeout(() => dispatch({ type: 'NEXT_CHAPTER' }), duration)
    return () => window.clearTimeout(timer)
  }, [rawState.chapterIndex, rawState.config.Cinematics.chapters, rawState.config.Cinematics.enabled, rawState.phase])

  // Paced stage advancement: smoothly progresses through each stage with visible dwell time
  useEffect(() => {
    const totalStages = rawState.config.Stages.length
    if (displayedStageIndex >= totalStages - 1) return

    const targetStage = rawState.phase === 'completing' ? totalStages - 1 : Math.max(displayedStageIndex, rawState.stageIndex)

    if (displayedStageIndex < targetStage) {
      const delay = rawState.phase === 'completing' ? 250 : 750
      const timer = window.setTimeout(() => {
        setDisplayedStageIndex((current: number) => Math.min(targetStage, current + 1))
      }, delay)
      return () => window.clearTimeout(timer)
    }
  }, [displayedStageIndex, rawState.stageIndex, rawState.phase, rawState.config.Stages.length])

  // Smooth progress interpolation
  useEffect(() => {
    const minProgress = stageProgressFloors[displayedStageIndex] ?? 0
    const target = Math.max(minProgress, rawState.progress)

    const timer = window.setInterval(() => {
      setDisplayedProgress((current: number) => {
        if (current >= target) return current
        const step = Math.max(0.008, (target - current) * 0.12)
        const next = Math.min(target, current + step)
        return Number(next.toFixed(3))
      })
    }, 30)

    return () => window.clearInterval(timer)
  }, [displayedStageIndex, rawState.progress])

  const state = useMemo<LoadingState>(() => ({
    ...rawState,
    stageIndex: displayedStageIndex,
    progress: displayedProgress,
    phase: rawState.phase === 'completing' && displayedStageIndex >= rawState.config.Stages.length - 1 ? 'completing' : 'loading',
  }), [rawState, displayedStageIndex, displayedProgress])

  return useMemo(() => ({ state, dispatch: dispatch as Dispatch<LoadingAction> }), [state])
}
