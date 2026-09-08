# Troubleshooting Guide

Solutions and debugging procedures for common FiveM loading screen issues.

---

## Diagnostic Tools

When troubleshooting issues in FiveM:

1. **Open NUI DevTools**:
   - In the F8 console, type:
     ```text
     nui_devtools
     ```
   - Open the **Console** and **Network** tabs to inspect file loading errors (such as 404s on media or audio files).

2. **Check Client Logs**:
   - Locate your local FiveM log file at:
     `%localappdata%\FiveM\FiveM.app\logs\CitizenFX.log`
   - Search for `sync_loading` to identify script errors or missing files.

---

## Common Issues & Solutions

### 1. Black or Blank Screen on Connection

| Possible Cause | Resolution |
| :--- | :--- |
| **Missing build files** | Verify that `web/dist/index.html` exists. Prebuilt releases include this directory; if compiling from source, run `pnpm build` inside `web/`. |
| **Resource folder renamed** | The folder **must** be named `sync_loading`. If renamed, update references in `fxmanifest.lua`, `client/main.lua`, and HTML paths. |
| **Stale client cache** | Clear FiveM client cache at `%localappdata%\FiveM\FiveM.app\data\nui-storage\`. |
| **Syntax error in `config.lua`** | Check your server console for Lua syntax errors. A broken comma or unclosed string in `config.lua` will halt resource startup. |

---

### 2. Music Does Not Play

| Possible Cause | Resolution |
| :--- | :--- |
| **CEF Autoplay Policy** | Chromium frequently blocks unmuted audio on initial connection before the user clicks. Click anywhere on the screen or click the Play icon on the audio player to unblock playback. |
| **Incorrect Audio Path** | Ensure the path in `Config.Music.tracks` is relative to `web/dist/`, e.g. `assets/audio/song.mp3`. |
| **Unsupported Audio Codec** | FiveM's CEF works best with standard MP3 (192kbps) or OGG Vorbis. Avoid proprietary AAC/M4A or uncompressed 24-bit/96kHz WAV files. |
| **404 File Not Found** | Open `nui_devtools` and inspect the Network tab to confirm your audio files return HTTP 200. |

---

### 3. Video Fails or Shows Black Background

| Possible Cause | Resolution |
| :--- | :--- |
| **Unsupported Video Codec** | CEF requires WebM (VP8/VP9) or standard H.264 MP4. HEVC (H.265), AV1, and ProRes will fail to decode. |
| **Resolution or Bitrate Too High** | High-bitrate 4K files can cause GPU out-of-memory errors in CEF. Re-encode to 1080p @ 30 FPS under 3,500 kbps using the recommended command in [Media Guide](MEDIA.md). |
| **Audio Track in Video** | Some CEF versions crash when decoding audio inside a background video element. Strip audio from background videos using `ffmpeg -an`. |

---

### 4. Loading Screen Stays Stuck & Does Not Close

| Possible Cause | Resolution |
| :--- | :--- |
| **`autoShutdown` set to `false` without trigger** | If `Config.Lifecycle.autoShutdown = false`, you must call `exports['sync_loading']:Complete()` or `TriggerEvent('sync_loading:complete')` from your spawn manager or character selector. |
| **Server-side call error** | `exports['sync_loading']:Complete()` is a **client-side** export. Calling it from a server script (`server.lua`) will fail silently. |
| **Failsafe timeout** | If all else fails, HORIZON will automatically dismiss itself once `Config.Lifecycle.failsafeDelay` (default 45s) elapses. Verify this value is not set to an excessively large number. |

---

### 5. UI Elements Clipped on Small Displays (720p)

| Possible Cause | Resolution |
| :--- | :--- |
| **Long Server Name or Slogan** | Set `Config.Layout.wedgeWidth = 'compact'` in [config.lua](file:///g:/SYNC%20WORKSHOP/development_phase/sync_loading/config.lua). |
| **Excessive Moment Text** | Keep community moments to 1–2 concise sentences. |

---

### 6. Config Changes Not Updating in Game

- Running `refresh` in server console does not clear CEF browser caches.
- **Solution**: Always restart the FiveM server after modifying `config.lua` or web files, and reconnect.
