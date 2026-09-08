fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'sync_loading'
author 'SYNC Lab'
description 'SYNC / 02 — HORIZON cinematic FiveM loading screen'
version '1.0.0'

loadscreen 'web/dist/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

shared_script 'config.lua'
server_script 'server/main.lua'
client_script 'client/main.lua'

files {
    'web/dist/**'
}
