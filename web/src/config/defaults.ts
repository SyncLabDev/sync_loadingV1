import type { HorizonConfig } from '../types'

export const defaultConfig: HorizonConfig = {
  Server: {
    name: 'HORIZON ROLEPLAY', shortName: 'HORIZON', tagline: 'Your story begins beyond the horizon.',
    location: 'LOS SANTOS', build: '01.24', showPlayerCount: true,
  },
  Brand: { logo: 'assets/branding/logo.png', accent: '#6BBFFF', showSyncLab: true },
  Layout: { wedgeSide: 'left', wedgeWidth: 'standard', safeHorizontal: 3.5, safeVertical: 3.5 },
  Media: {
    type: 'chapters', source: 'assets/media/horizon-boulevard.webp', fallback: 'assets/media/horizon-boulevard.webp',
    focalPoint: 'center', overlay: 0.3, ambientZoom: false,
  },
  Cinematics: {
    enabled: true, transition: 'soft_wipe', transitionDuration: 760,
    chapters: [
      { id: 'city', label: 'CITY', subtitle: 'The world is waiting.', type: 'image', media: 'assets/media/horizon-boulevard.webp', fallback: 'assets/media/horizon-boulevard.webp', focalPoint: 'center', duration: 9000 },
    ],
  },
  Stages: [
    { id: 'world', label: 'WORLD', activeMessage: 'Establishing world' },
    { id: 'identity', label: 'IDENTITY', activeMessage: 'Resolving identity' },
    { id: 'assets', label: 'ASSETS', activeMessage: 'Synchronizing assets' },
    { id: 'interface', label: 'INTERFACE', activeMessage: 'Building interface' },
    { id: 'session', label: 'SESSION', activeMessage: 'Finalizing session' },
  ],
  Progress: { style: 'line', showPercentage: true, showETA: false, showCheckpoints: true },
  Moments: {
    enabled: true, interval: 8000,
    items: [
      { category: 'community', title: 'COMMUNITY', text: 'Respect the story. Create memorable roleplay.' },
      { category: 'tip', title: 'BE PRESENT', text: 'Let the scene breathe. The best moments are shared.' },
      { category: 'roleplay', title: 'YOUR STORY', text: 'Listen first. React honestly. Leave a mark on the city.' },
    ],
  },
  Music: {
    enabled: true, mode: 'auto', autoplay: true, volume: 0.22, rememberVolume: true,
    shuffle: false, repeatMode: 'all', collapseAfter: 5000,
    tracks: [
      { title: 'HORIZON DRIFT', artist: 'SYNC LAB', file: 'assets/audio/horizon-drift.wav' },
    ],
  },
  Location: { enabled: true, title: 'LOS SANTOS', subtitle: 'Welcome back.' },
  Socials: [
    { label: 'DISCORD', url: 'https://discord.gg/yourserver' },
    { label: 'WEBSITE', url: 'https://example.com' },
    { label: 'STORE', url: 'https://example.com/store' },
  ],
  Performance: { mode: 'balanced' },
  Motion: { introDuration: 1150, completionDuration: 1450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  Lifecycle: { autoShutdown: true, shutdownDelay: 1700, failsafeDelay: 45000 },
  Debug: { printEvents: false },
}
