# Installation Guide

Step-by-step guide for deploying **SYNC Loading (HORIZON)** to your FiveM server.

---

## Prerequisites & Requirements

- **FiveM Server Artifact**: Cerulean or newer (Windows or Linux).
- **Framework Compatibility**: Standalone — 100% compatible with QBCore, ESX Legacy, Qbox, Ox, or standalone servers.
- **Dependencies**: None. No database, SQL tables, or Node.js runtime required on the server.
- **Frontend Assets**: Shipped pre-compiled in `web/dist/`.

---

## Standard Installation

### Step 1: Resource Placement
Download and extract the `sync_loading` folder into your server's resources directory:

```text
[server-data]/resources/
└── [sync]/
    └── sync_loading/
        ├── client/
        ├── server/
        ├── config.lua
        ├── fxmanifest.lua
        └── web/dist/
```

> [!WARNING]
> Keep the resource folder named `sync_loading`. Renaming the directory will break resource exports and NUI callbacks unless updated across client scripts.

### Step 2: Configure Server Details
Open [config.lua](file:///g:/SYNC%20WORKSHOP/development_phase/sync_loading/config.lua) and customize your server name, tagline, branding assets, and audio tracks.

### Step 3: Update `server.cfg`
Add the following commands to your `server.cfg`:

```cfg
# 1. Disable the native bottom-right FiveM spinner
setr sv_showBusySpinnerOnLoadingScreen false

# 2. Ensure sync_loading early in your start order
ensure sync_loading
```

> [!TIP]
> Ensure `sync_loading` starts before character selection or spawn scripts if using manual completion.

### Step 4: Restart Server
Fully restart your FiveM server (`refresh` is not always sufficient due to client-side NUI cache handling).

---

## Custom Lifecycle & Spawn Integration

By default in [config.lua](file:///g:/SYNC%20WORKSHOP/development_phase/sync_loading/config.lua), automatic shutdown is disabled (`Config.Lifecycle.autoShutdown = false`) so that HORIZON cleanly holds the loading screen open until your multicharacter system, character selection, or spawn selector is ready.

If your server does not use character selection or custom spawn logic and you want the screen to close as soon as FiveM client initialization finishes, set:
```lua
Config.Lifecycle.autoShutdown = true
```

### Trigger Completion in Your Spawn Resource (When `autoShutdown = false`)

Call either the export or the client event in your spawn management script once the player character or selector UI is ready:

#### Using Export (Recommended)
```lua
exports['sync_loading']:Complete()
```

#### Using Client Event
```lua
TriggerEvent('sync_loading:complete')
```

---

### Framework Integration Examples

#### QBCore (`qb-multicharacter` / `qb-spawn`)
In `qb-multicharacter/client/main.lua` or your custom spawn script, trigger completion right before opening the character UI:

```lua
RegisterNetEvent('qb-multicharacter:client:chooseChar', function()
    -- Complete HORIZON loading screen
    exports['sync_loading']:Complete()
    
    -- Open character selector UI
    SetNuiFocus(true, true)
    SendNUIMessage({ action = "openUI" })
end)
```

#### ESX Legacy (`esx_multicharacter`)
In `esx_multicharacter/client/main.lua`, when characters are received and UI is ready:

```lua
RegisterNetEvent('esx_multicharacter:SetupCharacters', function()
    exports['sync_loading']:Complete()
    -- Character selection display logic
end)
```

#### Ox Core (`ox_core`)
In your spawn handler when the player character is chosen:

```lua
AddEventHandler('ox:playerLoaded', function()
    exports['sync_loading']:Complete()
end)
```

---

## Failsafe Protection

If an integration error prevents your spawn script from firing `Complete()`, HORIZON includes an automatic failsafe timer:

```lua
Config.Lifecycle.failsafeDelay = 45000 -- 45 seconds safety cutoff
```

If the loading screen is held for longer than this duration, it will automatically dismiss to ensure players are never stuck on a black or loading screen.
