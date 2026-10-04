Config = {}

Config.Server = {
    name = 'HORIZON ROLEPLAY',
    shortName = 'HORIZON',
    tagline = 'Your story begins beyond the horizon.',
    location = 'LOS SANTOS',
    build = '01.24',
    showPlayerCount = true,
}

Config.Brand = {
    logo = 'assets/branding/logo.png',
    accent = '#6BBFFF',
    showSyncLab = true,
}

Config.Layout = {
    wedgeSide = 'left', -- left | right
    wedgeWidth = 'standard', -- compact | standard | wide
    safeHorizontal = 3.5,
    safeVertical = 3.5,
}

Config.Media = {
    type = 'chapters', -- video | image | slideshow | chapters | gradient
    source = 'assets/media/horizon-boulevard.webp',
    fallback = 'assets/media/horizon-boulevard.webp',
    focalPoint = 'center', -- left | center | right | top | bottom
    overlay = 0.30,
    ambientZoom = false,
}

Config.Cinematics = {
    enabled = true,
    transition = 'soft_wipe', -- fade | mask_left | mask_right | soft_wipe | none
    transitionDuration = 760,
    chapters = {
        {
            id = 'city',
            label = 'CITY',
            subtitle = 'The world is waiting.',
            type = 'image',
            media = 'assets/media/horizon-boulevard.webp',
            fallback = 'assets/media/horizon-boulevard.webp',
            focalPoint = 'center',
            duration = 9000,
        },
    },
}

Config.Stages = {
    { id = 'world', label = 'WORLD', activeMessage = 'Establishing world' },
    { id = 'identity', label = 'IDENTITY', activeMessage = 'Resolving identity' },
    { id = 'assets', label = 'ASSETS', activeMessage = 'Synchronizing assets' },
    { id = 'interface', label = 'INTERFACE', activeMessage = 'Building interface' },
    { id = 'session', label = 'SESSION', activeMessage = 'Finalizing session' },
}

Config.Progress = {
    style = 'line', -- line | segmented | minimal | percentage | stage_only | hidden
    showPercentage = true,
    showETA = false,
    showCheckpoints = true,
}

Config.Moments = {
    enabled = true,
    interval = 8000,
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
        {
            category = 'roleplay',
            title = 'YOUR STORY',
            text = 'Listen first. React honestly. Leave a mark on the city.',
        },
    },
}

Config.Music = {
    enabled = true,
    mode = 'auto', -- expanded | compact | auto
    autoplay = true,
    volume = 0.22,
    rememberVolume = true,
    shuffle = false,
    repeatMode = 'all', -- off | one | all
    collapseAfter = 5000,
    tracks = {
        {
            title = 'HORIZON DRIFT',
            artist = 'SYNC LAB',
            file = 'assets/audio/horizon-drift.wav',
        },
    },
}

Config.Location = {
    enabled = true,
    title = 'LOS SANTOS',
    subtitle = 'Welcome back.',
}

Config.Socials = {
    { label = 'DISCORD', url = 'https://discord.gg/yourserver' },
    { label = 'WEBSITE', url = 'https://example.com' },
    { label = 'STORE', url = 'https://example.com/store' },
}

Config.Performance = {
    mode = 'balanced', -- high | balanced | low
}

Config.Motion = {
    introDuration = 1150,
    completionDuration = 1450,
    easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
}

Config.Lifecycle = {
    autoShutdown = true,
    shutdownDelay = 1700,
    failsafeDelay = 45000,
}

Config.Debug = {
    printEvents = false,
}
