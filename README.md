# SYNC Loading — 01 / HORIZON

[![FiveM](https://img.shields.io/badge/FiveM-Cerulean-blue.svg?style=flat-square)](https://fivem.net/)
[![Lua](https://img.shields.io/badge/Lua-5.4-000080.svg?style=flat-square&logo=lua)](https://www.lua.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-SYNC%20Free%20Resource-6BBFFF.svg?style=flat-square)](LICENSE.md)

**HORIZON** is a cinematic FiveM loading screen by **SYNC Lab**. Designed with an asymmetric interface wedge that retracts seamlessly into gameplay, HORIZON keeps server media as the visual centerpiece while providing initialization milestones, playlist audio, server announcements, and full framework independence.

---

## Highlights

- **Cinematic Media Engine**: Supports WebM/MP4 background videos, high-resolution WebP images, multi-chapter slideshows, and smooth soft-wipe transitions with automatic gradient fallbacks.
- **True FiveM Integration**: Tracks real engine loading events (`loadProgress`, `startInitFunction`), 5 customizable milestone stages, and 6 distinct progress bar styles.
- **Asymmetric Interface Wedge**: Modern angled layout with customizable placement (left or right), adaptive width (compact, standard, wide), and ultrawide/4K responsive scaling.
- **Audio & Playlist System**: Integrated audio player featuring track playlists, cover art, volume persistence via local storage, autoplay policy fallback, and auto-collapse behavior.
- **Dynamic SYNC Moments**: Rotating announcements, server rules, and community tips with custom categorization and auto-interval cycling.
- **Server Telemetry**: Displays real-time player counts via server handover, current game build, and configurable location badges.
- **Flexible Lifecycle Control**: Supports instant automatic completion or custom spawn/multicharacter hooks via client exports and events, backed by a configurable hard failsafe.
- **Zero Runtime Dependencies**: Prebuilt distribution files included in `web/dist/` — no Node.js, pnpm, or web tools required on the server host.

---

## Quick Start

### 1. Installation

1. Copy the `sync_loading` folder directly into your FiveM server's resources directory:
   ```text
   resources/
   └── [sync]/
       └── sync_loading/
   ```
2. Open [config.lua](config.lua) and configure your server branding, media sources, and audio playlist.
3. Add the resource and recommended spinner override to your `server.cfg`:
   ```cfg
   # Hide the default bottom-right FiveM loading spinner
   setr sv_showBusySpinnerOnLoadingScreen false

   # Start SYNC Loading before framework & spawn managers
   ensure sync_loading
   ```
4. Restart your FiveM server and connect.

> [!NOTE]
> The included `web/dist/` folder is precompiled and ready for production. End users do not need Node.js installed.

---

## Custom Spawn & Multicharacter Integration

By default, HORIZON automatically closes when FiveM finishes initializing (`Config.Lifecycle.autoShutdown = true`).

For custom character selection (e.g. QBCore, ESX, Ox, or custom spawn scripts), set `Config.Lifecycle.autoShutdown = false` in [config.lua](config.lua) and trigger completion when your spawn UI is ready.

### Client Export (Recommended)
```lua
exports['sync_loading']:Complete()
```

### Client Event
```lua
TriggerEvent('sync_loading:complete')
```

> [!IMPORTANT]
> Always call `Complete()` or trigger `sync_loading:complete` from client-side scripts. If an integration failure occurs, HORIZON's internal failsafe (`Config.Lifecycle.failsafeDelay`) automatically closes the loading screen.

---

## Configuration Overview

All user configuration is handled in [config.lua](config.lua):

| Configuration Group | Key Settings | Description |
| :--- | :--- | :--- |
| `Config.Server` | `name`, `tagline`, `location`, `build`, `showPlayerCount` | Core server branding and live player count handover |
| `Config.Brand` | `logo`, `accent`, `showSyncLab` | Logo asset path, hex accent color, and brand credits |
| `Config.Layout` | `wedgeSide`, `wedgeWidth`, `safeHorizontal`, `safeVertical` | Position wedge on `'left'` or `'right'`, select compact/standard/wide |
| `Config.Media` | `type`, `source`, `fallback`, `focalPoint`, `overlay`, `ambientZoom` | Background source (`'video'`, `'image'`, `'chapters'`, `'gradient'`) |
| `Config.Cinematics` | `enabled`, `transition`, `transitionDuration`, `chapters` | Multi-scene rotation, transitions (`'soft_wipe'`, `'fade'`), and scene timings |
| `Config.Stages` | Ordered list of stages (`id`, `label`, `activeMessage`) | Custom milestone checkpoints matching client initialization |
| `Config.Progress` | `style`, `showPercentage`, `showETA`, `showCheckpoints` | Progress styling (`'line'`, `'segmented'`, `'minimal'`, `'percentage'`, etc.) |
| `Config.Moments` | `enabled`, `interval`, `items` | Rotating community cards, server rules, or tips |
| `Config.Music` | `enabled`, `mode`, `autoplay`, `volume`, `tracks` | Audio playlist, cover art, track titles, and autoplay behavior |
| `Config.Socials` | Ordered list of `{ label, url }` | Direct links to Discord, community website, or store |
| `Config.Lifecycle` | `autoShutdown`, `shutdownDelay`, `failsafeDelay` | Automation and transition timing for resource shutdown |

For a deep dive into every available option, consult the [Configuration Guide](docs/CONFIGURATION.md).

---

## Directory Structure

```text
sync_loading/
├── client/
│   └── main.lua             # Client bridge, NUI messaging, and lifecycle exports
├── server/
│   └── main.lua             # Handover data sanitation and player count provider
├── config.lua               # Master configuration file
├── fxmanifest.lua           # FiveM resource manifest
├── docs/                    # Full technical documentation suite
│   ├── ASSET_LICENSE.md     # Licensing terms for bundled demonstration media
│   ├── CONFIGURATION.md     # Detailed config.lua reference
│   ├── CUSTOMIZATION.md     # Brand, layout, and styling instructions
│   ├── DEVELOPMENT.md       # Frontend build and dev server guide
│   ├── FIVEM_QA.md          # Release verification and QA checklist
│   ├── INSTALLATION.md      # Detailed installation instructions
│   ├── MEDIA.md             # Resolution, bitrate, and codec guidelines
│   ├── MUSIC.md             # Audio formats, autoplay policies, and track setup
│   └── TROUBLESHOOTING.md   # Common issues and solutions
└── web/                     # React 19 + TypeScript + Vite frontend source
    ├── dist/                # Precompiled production build loaded by FiveM
    ├── public/              # Static media, audio, and branding assets
    └── src/                 # Component source, design tokens, and state management
```

---

## Documentation Index

Explore the full documentation suite in the `docs/` directory:

- [Installation Guide](docs/INSTALLATION.md) — Server setup and configuration prerequisites.
- [Configuration Reference](docs/CONFIGURATION.md) — Comprehensive breakdown of every `config.lua` parameter.
- [Customization Guide](docs/CUSTOMIZATION.md) — Tips on tailoring logos, colors, typography, and wedge alignment.
- [Media Guide](docs/MEDIA.md) — Codec requirements (WebM/MP4), resolution guidelines, and fallback behaviors.
- [Music Guide](docs/MUSIC.md) — Autoplay compliance, audio formats (OGG/MP3), and playlist setup.
- [Development Guide](docs/DEVELOPMENT.md) — Frontend development server, dev controller, and testing commands.
- [FiveM QA Checklist](docs/FIVEM_QA.md) — Pre-flight QA matrix for server releases.
- [Troubleshooting](docs/TROUBLESHOOTING.md) — Solutions for black screens, audio blocking, and CEF caching.
- [Asset License](docs/ASSET_LICENSE.md) — Terms for bundled demo media and client licensing responsibilities.

---

## Frontend Development

For developers looking to customize the UI or build from source:

```bash
# Navigate to the frontend directory
cd web

# Install dependencies
pnpm install

# Start Vite dev server with SYNC DEV mock controller
pnpm dev

# Run typechecks and unit tests
pnpm typecheck
pnpm test

# Build production bundle into web/dist
pnpm build
```

The local development server includes the **SYNC DEV / HORIZON** controller, allowing you to test progress states, simulate stages, switch chapters, test media error fallbacks, and trigger completion transitions without booting a FiveM server.

### Build a Release Archive

From the repository root on Windows, run:

```powershell
./scripts/build-release.ps1 -Version 1.0.0
```

The script rebuilds and verifies the frontend, checks the Lua files and production package, then creates `release/sync_loading-v1.0.0.zip` with a matching SHA-256 checksum. The archive contains only the ready-to-install FiveM resource; development source and tooling are excluded.

---

## License & Credits

- Released free of charge under the [SYNC LAB FREE RESOURCE LICENSE](LICENSE.md). Copyright © 2026 SYNC Lab.
- Bundled demo images and ambient tracks are original demonstration placeholders. Server owners are responsible for licensing replacement audio, video footage, and branding.
- See [Software License](LICENSE.md) and [Asset License Notes](docs/ASSET_LICENSE.md) for full terms.
