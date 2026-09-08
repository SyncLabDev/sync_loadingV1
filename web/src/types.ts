export type WedgeSide = 'left' | 'right'
export type WedgeWidth = 'compact' | 'standard' | 'wide'
export type FocalPoint = 'left' | 'center' | 'right' | 'top' | 'bottom'
export type MediaType = 'video' | 'image' | 'slideshow' | 'chapters' | 'gradient'
export type ChapterMediaType = 'video' | 'image'
export type TransitionMode = 'fade' | 'mask_left' | 'mask_right' | 'soft_wipe' | 'none'
export type ProgressStyle = 'line' | 'segmented' | 'minimal' | 'percentage' | 'stage_only' | 'hidden'
export type PerformanceMode = 'high' | 'balanced' | 'low'
export type MusicMode = 'expanded' | 'compact' | 'auto'
export type RepeatMode = 'off' | 'one' | 'all'
export type StageStatus = 'pending' | 'active' | 'complete'
export type LoadingPhase = 'loading' | 'completing'

export interface ServerConfig {
  name: string
  shortName: string
  tagline: string
  location: string
  build: string
  showPlayerCount: boolean
}

export interface BrandConfig { logo?: string; accent: string; showSyncLab: boolean }
export interface LayoutConfig { wedgeSide: WedgeSide; wedgeWidth: WedgeWidth; safeHorizontal: number; safeVertical: number }
export interface MediaConfig { type: MediaType; source?: string; fallback?: string; focalPoint: FocalPoint; overlay: number; ambientZoom: boolean }

export interface CinematicChapter {
  id: string
  label: string
  subtitle?: string
  type: ChapterMediaType
  media: string
  fallback?: string
  focalPoint: FocalPoint
  duration: number
}

export interface CinematicsConfig { enabled: boolean; transition: TransitionMode; transitionDuration: number; chapters: CinematicChapter[] }
export interface StageConfig { id: string; label: string; activeMessage: string }
export interface ProgressConfig { style: ProgressStyle; showPercentage: boolean; showETA: boolean; showCheckpoints: boolean }
export interface MomentConfig { category: string; title: string; text: string }
export interface MomentsConfig { enabled: boolean; interval: number; items: MomentConfig[] }
export interface MusicTrack { title: string; artist: string; file: string; coverArt?: string }
export interface MusicConfig { enabled: boolean; mode: MusicMode; autoplay: boolean; volume: number; rememberVolume: boolean; shuffle: boolean; repeatMode: RepeatMode; collapseAfter: number; tracks: MusicTrack[] }
export interface LocationConfig { enabled: boolean; title: string; subtitle: string }
export interface SocialLink { label: string; url: string }
export interface MotionConfig { introDuration: number; completionDuration: number; easing: string }
export interface LifecycleConfig { autoShutdown: boolean; shutdownDelay: number; failsafeDelay: number }

export interface HorizonConfig {
  Server: ServerConfig
  Brand: BrandConfig
  Layout: LayoutConfig
  Media: MediaConfig
  Cinematics: CinematicsConfig
  Stages: StageConfig[]
  Progress: ProgressConfig
  Moments: MomentsConfig
  Music: MusicConfig
  Location: LocationConfig
  Socials: SocialLink[]
  Performance: { mode: PerformanceMode }
  Motion: MotionConfig
  Lifecycle: LifecycleConfig
  Debug: { printEvents: boolean }
}

export interface LoadingStage extends StageConfig { status: StageStatus }
export type Milestone = 'identity' | 'assets-start' | 'assets-end' | 'interface-start' | 'interface-end' | 'session'

export interface LoadingState {
  config: HorizonConfig
  progress: number
  phase: LoadingPhase
  stageIndex: number
  milestones: Set<Milestone>
  chapterIndex: number
  momentIndex: number
  playerCount?: number
  message?: string
  startedAt: number
  samples: Array<{ time: number; progress: number }>
}

export type LoadingAction =
  | { type: 'CONFIG'; config: HorizonConfig; playerCount?: number }
  | { type: 'PROGRESS'; progress: number; time?: number }
  | { type: 'MILESTONE'; milestone: Milestone }
  | { type: 'SET_CHAPTER'; index: number }
  | { type: 'NEXT_CHAPTER' }
  | { type: 'NEXT_MOMENT' }
  | { type: 'SET_STAGE'; index: number }
  | { type: 'SET_PERFORMANCE'; mode: PerformanceMode }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }

export type NativeLoadingEvent =
  | { eventName: 'loadProgress'; loadFraction: number }
  | { eventName: 'startDataFileEntries' }
  | { eventName: 'endDataFileEntries' }
  | { eventName: 'startInitFunction' }
  | { eventName: 'endInitFunction' }
  | { eventName: 'onLogLine'; message: string }

export type SyncLoadingEvent =
  | { eventName: 'sync_loading:config'; config: unknown; playerCount?: unknown }
  | { eventName: 'sync_loading:complete' }

declare global {
  interface Window {
    invokeNative?: (command: string, argument?: string) => unknown
    nuiHandoverData?: { syncLoading?: unknown; playerCount?: unknown; serverAddress?: string }
  }
}
