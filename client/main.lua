local completed = false

local function send(eventName, payload)
    payload = payload or {}
    payload.eventName = eventName
    SendLoadingScreenMessage(json.encode(payload))
end

local function completeLoadingScreen()
    if completed then return end
    completed = true

    send('sync_loading:complete')
    Wait(math.max(0, math.min(5000, tonumber(Config.Lifecycle.shutdownDelay) or 1700)))
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
end

exports('Complete', completeLoadingScreen)
AddEventHandler('sync_loading:complete', completeLoadingScreen)
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', completeLoadingScreen)
RegisterNetEvent('qbx_core:client:playerLoaded', completeLoadingScreen)
RegisterNetEvent('esx:playerLoaded', completeLoadingScreen)
RegisterNetEvent('ox:playerLoaded', completeLoadingScreen)

CreateThread(function()
    Wait(0)
    send('sync_loading:config', { config = Config })

    if Config.Lifecycle.autoShutdown then
        while not NetworkIsSessionStarted() do
            Wait(100)
        end
        completeLoadingScreen()
        return
    end

    -- When autoShutdown is false, monitor for character selection or player session
    CreateThread(function()
        while not completed do
            Wait(250)
            if NetworkIsInTutorialSession() or (LocalPlayer and LocalPlayer.state and LocalPlayer.state.isLoggedIn) then
                Wait(500)
                completeLoadingScreen()
                break
            end
        end
    end)

    Wait(math.max(5000, math.min(180000, tonumber(Config.Lifecycle.failsafeDelay) or 45000)))
    completeLoadingScreen()
end)

AddEventHandler('onClientResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() and not completed then
        ShutdownLoadingScreen()
        ShutdownLoadingScreenNui()
    end
end)
