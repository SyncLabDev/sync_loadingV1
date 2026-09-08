# FiveM QA Release Checklist

Comprehensive quality assurance checklist to verify **SYNC Loading (HORIZON)** prior to production deployment.

---

## 1. Lifecycle & Engine Milestones

- [ ] **Cold-Cache Boot**: Screen displays immediately upon server connection before full asset download.
- [ ] **Warm-Cache Reconnect**: Reconnecting with cached assets does not produce a white or black flash.
- [ ] **Real Progress Tracking**: Progress bar smoothly advances as `loadProgress` fractions arrive from FiveM.
- [ ] **Stage Advancement**: Initialization stages (`WORLD`, `IDENTITY`, `ASSETS`, `INTERFACE`, `SESSION`) advance monotonically.
- [ ] **Automatic Completion**: When `Config.Lifecycle.autoShutdown = true`, the wedge retracts and the screen dismisses cleanly upon connection completion.
- [ ] **Custom Export Completion**: When `Config.Lifecycle.autoShutdown = false`, calling `exports['sync_loading']:Complete()` cleanly triggers the exit transition.
- [ ] **Failsafe Timeout**: If a custom spawn script stalls, the screen automatically closes after `Config.Lifecycle.failsafeDelay`.
- [ ] **Resource Stop**: Running `stop sync_loading` in server console cleanly shuts down the NUI without leaving artifacts on screen.

---

## 2. Media & Visual Fidelity

- [ ] **Primary Media**: Video and image backgrounds render with correct aspect ratio and focal point alignment.
- [ ] **Transitions**: In chapter/slideshow modes, transitions (e.g. `soft_wipe`, `fade`) transition smoothly without stutter.
- [ ] **Video Failure Fallback**: Disabling or renaming video file triggers immediate fallback to `Config.Media.fallback`.
- [ ] **Image Failure Fallback**: Missing images fall back cleanly to the branded CSS radial gradient.
- [ ] **No Error Badges**: Corrupted or missing media never renders broken image icons or browser error badges.

---

## 3. Audio & Music Player

- [ ] **Autoplay Unblock**: If browser policy halts autoplay, clicking anywhere or pressing Play starts audio.
- [ ] **Track Controls**: Play/pause, track skip, volume slider, and track scrubbing operate responsively.
- [ ] **Volume Memory**: When `Config.Music.rememberVolume = true`, adjusted volume persists after server reconnect.
- [ ] **Auto-Collapse**: Player in `'auto'` mode starts compact, expands on mouse hover, and collapses after inactivity.
- [ ] **Missing Track**: Missing audio file gracefully hides player element without freezing loading.
- [ ] **Clean Fadeout**: Audio gracefully fades out or stops when the loading screen completes.

---

## 4. Multi-Resolution & Responsive Layouts

- [ ] **720p / 1366×768**: Wedge text, brand logo, and controls remain unclipped and legible.
- [ ] **1080p / 1440p**: Standard viewports render sharp typography and balanced spacing.
- [ ] **Ultrawide (21:9 / 32:9)**: Interface wedge maintains standard percentage width and does not stretch or bleed off-screen.
- [ ] **Left vs. Right Wedge**: Switching `Config.Layout.wedgeSide` to `'right'` correctly mirrors the interface while preserving left-to-right text readability.
- [ ] **Reduced Motion**: System `prefers-reduced-motion` settings disable ambient zooms and excessive motion effects.

---

## 5. Configuration & Resilience

- [ ] **Default Fallbacks**: Starting with an empty or minimal `config.lua` gracefully boots with internal defaults.
- [ ] **Sanitization**: Accents without `#`, out-of-range volume numbers, or negative delays are safely clamped.
- [ ] **No Exposed Secrets**: Verify `config.lua` contains no webhooks, passwords, or administrative tokens.
- [ ] **Dev Controller Absence**: Ensure `SYNC DEV` controller is completely absent from production builds.
