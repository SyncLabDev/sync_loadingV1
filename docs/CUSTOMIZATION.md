# Customization Guide

Guidelines for customizing visual elements, logos, color schemes, and interface styling for **SYNC / HORIZON**.

---

## 1. Brand Logo & Accent Color

### Logo Setup
Place your server's logo in:
```text
sync_loading/
└── web/dist/assets/branding/your-logo.svg
```

In [config.lua](file:///g:/SYNC%20WORKSHOP/development_phase/sync_loading/config.lua):
```lua
Config.Brand = {
    logo = 'assets/branding/your-logo.svg', -- SVG, WebP, or PNG
    accent = '#6BBFFF',                    -- 6-digit hex color
    showSyncLab = true,                    -- Show discreet SYNC Lab tag
}
```

- **Recommended Dimensions**: 120px to 220px width at 1080p.
- **Formats**: SVG is strongly recommended for crisp rendering across 1080p, 1440p, and 4K displays. High-resolution PNG or WebP with transparency is also supported.
- **Failover**: If the logo file fails to load or is left empty, HORIZON cleanly renders your server's text name (`Config.Server.name`).

### Accent Color Engine
HORIZON dynamically computes highlights, focus rings, progress bar fills, and subtle ambient glows directly from `Config.Brand.accent`.
- Choose a vibrant, high-contrast hex code (e.g. Cyan `#00F0FF`, Purple `#A855F7`, Amber `#F59E0B`, Crimson `#EF4444`).
- Dark backgrounds and surface tones remain mathematically balanced to maintain high contrast and readability.

---

## 2. Wedge Placement & Geometry

Adjust the interface wedge positioning in `Config.Layout`:

```lua
Config.Layout = {
    wedgeSide = 'left',      -- 'left' | 'right'
    wedgeWidth = 'standard', -- 'compact' | 'standard' | 'wide'
    safeHorizontal = 3.5,    -- Horizontal viewport margin (%)
    safeVertical = 3.5,      -- Vertical viewport margin (%)
}
```

- **`wedgeSide = 'left'`**: Traditional loading screen orientation. Fosters visual weight on the left while your background media shines in the center and right.
- **`wedgeSide = 'right'`**: Mirrors the asymmetric wedge to the right side of the screen while keeping text readably left-aligned.
- **`wedgeWidth`**:
  - `'compact'`: ~28% screen width (maximizes background visibility).
  - `'standard'`: ~33% screen width (balanced for medium-length server names and messages).
  - `'wide'`: ~38% screen width (ideal for long server titles or multi-line moments).

---

## 3. Progress Styles

HORIZON offers 6 distinctive styles for `Config.Progress.style`:

| Style | Appearance | Best For |
| :--- | :--- | :--- |
| `'line'` | Continuous high-precision bar with subtle glowing head | Modern, sleek roleplay servers |
| `'segmented'` | Five-segment progress block corresponding to load checkpoints | Technical, military, or cyberpunk aesthetics |
| `'minimal'` | Thin 2px unobtrusive accent line | Cinematic servers emphasizing video footage |
| `'percentage'` | Centered digital percentage readout with subtle bar | Clean, minimalist interface |
| `'stage_only'` | Highlights active initialization stage without percent math | Servers wanting narrative-driven loading |
| `'hidden'` | Hides the progress bar entirely | Pure cinematic showcase |

---

## 4. Customizing Moments

SYNC Moments cycle through announcements, rules, or tips:

```lua
Config.Moments = {
    enabled = true,
    interval = 8000, -- Rotation interval in ms
    items = {
        {
            category = 'community',
            title = 'COMMUNITY GUIDELINES',
            text = 'Join our Discord to read the full community rules and regulations.',
        },
        {
            category = 'tip',
            title = 'VEHICLE REGISTRATION',
            text = 'Visit the DMV at Legion Square to register your vehicle before driving.',
        },
        {
            category = 'update',
            title = 'UPDATE v2.4',
            text = 'New housing interiors and mechanic shops are now live across Los Santos.',
        },
    },
}
```

---

## 5. Typography

HORIZON includes pre-bundled, high-performance web fonts:
- **Primary Interface**: [Manrope Variable](https://fonts.google.com/specimen/Manrope) — clean modern sans-serif.
- **Telemetry & Badges**: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — technical monospace for coordinates, percentages, and build tags.

---

## 6. Advanced CSS Customization

If building from source with Vite, core design tokens are defined in `web/src/styles.css`:

- `--color-horizon-accent`: Dynamic CSS accent variable derived from `config.lua`.
- `--wedge-angle`: Asymmetric clip angle for the interface container.
- `--surface-overlay`: Backing glassmorphic opacity values.
