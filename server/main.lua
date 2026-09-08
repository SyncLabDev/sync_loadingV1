local function clamp(value, minimum, maximum, fallback)
    value = tonumber(value)
    if not value then return fallback end
    return math.min(maximum, math.max(minimum, value))
end

local function safeText(value, fallback, maximum)
    if type(value) ~= 'string' then return fallback end
    value = value:gsub('[%c]', ''):sub(1, maximum or 120)
    return value ~= '' and value or fallback
end

local function playerCount()
    local players = GetPlayers()
    return type(players) == 'table' and #players or nil
end

local function publicConfig()
    local config = Config
    config.Brand.accent = safeText(config.Brand.accent, '#6BBFFF', 32)
    config.Media.overlay = clamp(config.Media.overlay, 0, 0.85, 0.30)
    config.Music.volume = clamp(config.Music.volume, 0, 1, 0.22)
    config.Music.collapseAfter = clamp(config.Music.collapseAfter, 1500, 30000, 5000)
    config.Motion.introDuration = clamp(config.Motion.introDuration, 0, 3000, 1150)
    config.Motion.completionDuration = clamp(config.Motion.completionDuration, 0, 3000, 1450)
    config.Lifecycle.shutdownDelay = clamp(config.Lifecycle.shutdownDelay, 0, 5000, 1700)
    config.Lifecycle.failsafeDelay = clamp(config.Lifecycle.failsafeDelay, 5000, 180000, 45000)
    return config
end

AddEventHandler('playerConnecting', function(_, _, deferrals)
    deferrals.handover({
        syncLoading = publicConfig(),
        playerCount = Config.Server.showPlayerCount and playerCount() or nil,
    })
end)
