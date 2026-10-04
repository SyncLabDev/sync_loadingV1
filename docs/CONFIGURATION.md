# Configuration Reference

All user configuration for **SYNC / HORIZON** is defined in [`config.lua`](../config.lua). Values are validated, clamped, and sanitized before reaching the browser NUI.

---

## Configuration Blocks

### `Config.Server`
Server identity and live telemetry handover.

```lua
Config.Server = {
    name = 'HORIZON ROLEPLAY',    -- Full server title
    shortName = 'HORIZON',        -- Compact title used in headers/badges
    tagline = 'Your story begins beyond the horizon.',
    location = 'LOS SANTOS',      -- Displayed in location badge
    build = '01.24',              -- Server build or version tag
    showPlayerCount = true,       -- Queries server for live connected player count
}
```

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `'HORIZON ROLEPLAY'` | Full server name displayed in interface header |
| `shortName` | `string` | `'HORIZON'` | Shorter display name for badges and compact UI |
| `tagline` | `string` | `'Your story begins beyond the horizon.'` | Secondary slogan displayed beneath server name |
| `location` | `string` | `'LOS SANTOS'` | In-game geographic designation |
| `build` | `string` | `'01.24'` | Version, season, or build badge identifier |
| `showPlayerCount` | `boolean` | `true` | Display active online player count via handover |

---

### `Config.Brand`
Visual brand identity and primary color accents.

```lua
Config.Brand = {
    logo = 'assets/branding/logo.png',         -- PNG, WebP, or SVG
    accent = '#6BBFFF',                        -- 6-digit hex accent color
    showSyncLab = true,                        -- Display small SYNC Lab credit mark
}
```

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `logo` | `string` | `'assets/branding/logo.png'` | Relative path to brand mark inside `web/dist/` |
| `accent` | `string` | `'#6BBFFF'` | Primary brand hex code; derives glowing UI states |
| `showSyncLab` | `boolean` | `true` | Show discrete "SYNC Lab" development badge |

---

### `Config.Layout`
Wedge interface geometry and screen placement.

```lua
Config.Layout = {
    wedgeSide = 'left',      -- 'left' | 'right'
    wedgeWidth = 'standard', -- 'compact' | 'standard' | 'wide'
    safeHorizontal = 3.5,    -- Horizontal viewport padding (%)
    safeVertical = 3.5,      -- Vertical viewport padding (%)
}
```

| Key | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `wedgeSide` | `string` | `'left'`, `'right'` | Anchors the asymmetric wedge to the left or right |
| `wedgeWidth` | `string` | `'compact'`, `'standard'`, `'wide'` | Wedge width percentage (compact ~28%, standard ~33%, wide ~38%) |
| `safeHorizontal` | `number` | `0` to `10` | Screen margin padding as percentage of viewport width |
| `safeVertical` | `number` | `0` to `10` | Screen margin padding as percentage of viewport height |

---

### `Config.Media`
Primary visual background configuration and fallback behavior.

```lua
Config.Media = {
    type = 'chapters',      -- 'video' | 'image' | 'slideshow' | 'chapters' | 'gradient'
    source = 'assets/media/horizon-boulevard.webp',
    fallback = 'assets/media/horizon-boulevard.webp',
    focalPoint = 'center',  -- 'left' | 'center' | 'right' | 'top' | 'bottom'
    overlay = 0.30,         -- Darkness tint (0.00 to 0.85)
    ambientZoom = false,    -- Subtle cinematic zoom animation
}
```

| Key | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | `'video'`, `'image'`, `'slideshow'`, `'chapters'`, `'gradient'` | Visual background presentation mode |
| `source` | `string` | Relative path | Primary media file (MP4, WebM, WebP, JPG) |
| `fallback` | `string` | Relative path | Image fallback if primary video fails to load |
| `focalPoint` | `string` | `'left'`, `'center'`, `'right'`, `'top'`, `'bottom'` | CSS `object-position` anchor |
| `overlay` | `number` | `0.0` to `0.85` | Darkening overlay multiplier to ensure text contrast |
| `ambientZoom` | `boolean` | `true`, `false` | Slow continuous Ken Burns zoom effect |

---

### `Config.Cinematics`
Multi-scene chapter sequence settings when `Config.Media.type = 'chapters'` or `'slideshow'`.

```lua
Config.Cinematics = {
    enabled = true,
    transition = 'soft_wipe', -- 'fade' | 'mask_left' | 'mask_right' | 'soft_wipe' | 'none'
    transitionDuration = 760, -- Transition speed in milliseconds
    chapters = {
        {
            id = 'city',
            label = 'CITY',
            subtitle = 'The world is waiting.',
            type = 'image', -- 'image' | 'video'
            media = 'assets/media/horizon-boulevard.webp',
            fallback = 'assets/media/horizon-boulevard.webp',
            focalPoint = 'center',
            duration = 9000, -- Duration in ms (clamped between 2000 and 60000)
        },
    },
}
```

---

### `Config.Stages`
Ordered loading milestone checklist shown above the progress indicator.

```lua
Config.Stages = {
    { id = 'world',     label = 'WORLD',     activeMessage = 'Establishing world' },
    { id = 'identity',  label = 'IDENTITY',  activeMessage = 'Resolving identity' },
    { id = 'assets',    label = 'ASSETS',    activeMessage = 'Synchronizing assets' },
    { id = 'interface', label = 'INTERFACE', activeMessage = 'Building interface' },
    { id = 'session',   label = 'SESSION',   activeMessage = 'Finalizing session' },
}
```

---

### `Config.Progress`
Progress bar style and telemetry metrics.

```lua
Config.Progress = {
    style = 'line',           -- 'line' | 'segmented' | 'minimal' | 'percentage' | 'stage_only' | 'hidden'
    showPercentage = true,    -- Display numerical percent readout (0% – 100%)
    showETA = false,          -- Calculate estimated time remaining after 4s stable progress
    showCheckpoints = true,   -- Visual segment markers for milestones
}
```

---

### `Config.Moments`
Rotating announcements, community guidelines, and roleplay tips.

```lua
Config.Moments = {
    enabled = true,
    interval = 8000, -- Milliseconds between rotations
    items = {
        {
            category = 'community',
            title = 'COMMUNITY',
            text = 'Respect the story. Create memorable roleplay.',
        },
        {
            category = 'tip',
            title = 'BE PRESENT',
            text = 'Let the scene breathe. The best moments are shared.',
        },
    },
}
```

---

### `Config.Music`
Integrated background music playlist and audio behavior.

```lua
Config.Music = {
    enabled = true,
    mode = 'auto',           -- 'auto' | 'expanded' | 'compact'
    autoplay = true,
    volume = 0.22,           -- Default volume level (0.0 to 1.0)
    rememberVolume = true,   -- Persist player volume in browser localStorage
    shuffle = false,
    repeatMode = 'all',      -- 'off' | 'one' | 'all'
    collapseAfter = 5000,    -- Inactivity delay in ms before auto-collapsing
    tracks = {
        {
            title = 'HORIZON DRIFT',
            artist = 'SYNC LAB',
            file = 'assets/audio/horizon-drift.wav',
        },
    },
}
```

---

### `Config.Socials`
Direct outbound links displayed at the base of the wedge interface.

```lua
Config.Socials = {
    { label = 'DISCORD', url = 'https://discord.gg/yourserver' },
    { label = 'WEBSITE', url = 'https://example.com' },
    { label = 'STORE',   url = 'https://example.com/store' },
}
```

> [!NOTE]
> Only standard `http://` and `https://` URLs are accepted. Traversal (`..`) or script URLs are sanitized out for security.

---

### `Config.Lifecycle`
Shutdown and completion transition settings.

```lua
Config.Lifecycle = {
    autoShutdown = true,    -- Close immediately when FiveM finishes client init
    shutdownDelay = 1700,   -- Transition animation duration before NUI teardown
    failsafeDelay = 45000,  -- Hard safety cutoff (ms) if custom completion is blocked
}
```

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoShutdown` | `boolean` | `true` | If `true`, completes automatically; if `false`, awaits export call |
| `shutdownDelay` | `number` | `1700` | Duration (ms) of the retraction animation before NUI is shut down |
| `failsafeDelay` | `number` | `45000` | Safety timeout to ensure players never get stuck on a loading screen |

---

## Security Best Practices

> [!CAUTION]
> All parameters inside `config.lua` are transmitted to the client-side NUI interface. Never place API keys, private database passwords, webhook tokens, or server secrets in this file.
