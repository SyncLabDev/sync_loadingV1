# Music & Audio Configuration

HORIZON features a built-in, responsive audio player designed specifically for FiveM's Chromium Embedded Framework (CEF) environment.

---

## Audio Track Configuration

Audio tracks are configured as an array in [config.lua](file:///g:/SYNC%20WORKSHOP/development_phase/sync_loading/config.lua):

```lua
Config.Music = {
    enabled = true,
    mode = 'auto',           -- 'auto' | 'expanded' | 'compact'
    autoplay = true,         -- Attempt auto-playback on connect
    volume = 0.45,           -- Default initial volume (0.0 to 1.0)
    rememberVolume = true,   -- Store user's volume adjustments in localStorage
    shuffle = false,         -- Randomize track order
    repeatMode = 'all',      -- 'off' | 'one' | 'all'
    collapseAfter = 5000,    -- Inactivity delay (ms) before auto-collapsing in 'auto' mode
    tracks = {
        {
            title = 'GRAILED',
            artist = '1nonly & Freddie Dredd',
            file = 'assets/audio/grailed.mp3',
            coverArt = 'assets/audio/grailed-cover.jpg', -- Optional square album art
        },
        {
            title = 'HOLD MY HAND!',
            artist = 'MVSTERIOUS & KVRXD',
            file = 'assets/audio/hold-my-hand.mp3',
            coverArt = 'assets/audio/hold-my-hand-cover.jpg',
        },
    },
}
```

---

## Adding Your Own Music

### 1. File Placement
Place your audio and album art files in:
```text
sync_loading/
└── web/dist/assets/audio/
    ├── your-song.mp3
    └── your-album-art.jpg
```

> [!NOTE]
> For source builds, also place them in `web/public/assets/audio/` so they are copied into `web/dist/` on build. If running prebuilt, editing `web/dist/assets/audio/` directly works immediately without rebuilding.

### 2. Update `config.lua`
Register the new track in `Config.Music.tracks`:
```lua
{
    title = 'Track Title',
    artist = 'Artist Name',
    file = 'assets/audio/your-song.mp3',
    coverArt = 'assets/audio/your-album-art.jpg',
}
```

---

## Player Modes

| Mode | Behavior |
| :--- | :--- |
| `'auto'` | Starts in compact mode; expands when hovered or focused; collapses after `collapseAfter` milliseconds of inactivity. |
| `'expanded'` | Remains fully expanded showing cover art, playback controls, scrubber, and track metadata at all times. |
| `'compact'` | Minimal bar showing title and play/pause toggle. |

---

## Format & Codec Guidelines

FiveM's CEF environment has specific audio decoder compatibility:

- **Recommended Formats**: `.mp3` or `.ogg` (Vorbis).
- **Bitrate**: 128 kbps to 192 kbps is optimal for fast loading and low memory usage.
- **Sample Rate**: 44.1 kHz or 48.0 kHz stereo.
- **Audio Normalization**: Normalize tracks to **-14 LUFS** to avoid jarring volume shifts between tracks.

### Recommended FFmpeg Command for Audio
To convert and compress audio for production:
```bash
ffmpeg -i source.wav -vn -c:a libmp3lame -b:a 192k -ar 44100 output.mp3
```

---

## CEF Autoplay Behavior

Chromium restricts unmuted media autoplay without prior user interaction in certain conditions.

- **Handled Gracefully**: If FiveM blocks initial audio autoplay, the UI seamlessly registers this as a "paused" state with a clear Play button.
- **Interactive Start**: Clicking anywhere on the screen or clicking the play icon immediately unlocks audio playback.
- **Graceful Failure**: If an audio file is missing or corrupted (404), the player cleanly hides itself and will never block or crash the loading screen.

---

## Volume Persistence

When `Config.Music.rememberVolume = true`, any volume level chosen by the player (including mute) is saved to the client's local browser storage under a scoped key. The user's preferred volume level will persist across reconnections.

---

## Licensing & Copyright

> [!IMPORTANT]
> The demonstration tracks included with this resource are for testing and demonstration purposes. Server owners are legally responsible for licensing any commercial or copyright-protected music streamed to players.
