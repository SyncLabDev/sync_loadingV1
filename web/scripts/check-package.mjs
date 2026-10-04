import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const required = ['dist/index.html', 'dist/assets/branding/sync-horizon.svg', 'dist/assets/media/horizon-boulevard.webp', 'dist/assets/audio/horizon-drift.wav']
for (const file of required) {
  if (!existsSync(resolve(file))) throw new Error(`Missing production file: ${file}`)
}

const forbidden = ['grailed.mp3', 'grailed-cover.jpg', 'hold-my-hand.mp3', 'hold-my-hand-cover.jpg']
for (const file of forbidden) {
  if (existsSync(resolve('dist/assets/audio', file))) throw new Error(`Preview-only asset leaked into production: ${file}`)
}

const files = readdirSync(resolve('dist/assets'), { recursive: true }).map(String)
const js = files.filter(file => file.endsWith('.js')).map(file => readFileSync(resolve('dist/assets', file), 'utf8')).join('\n')
if (js.includes('SYNC DEV') || js.includes('Horizon development controller')) throw new Error('Development controller leaked into production build')

const bytes = files.reduce((total, file) => { const path = resolve('dist/assets', file); return total + (statSync(path).isFile() ? statSync(path).size : 0) }, 0)
console.log(`Production package OK — ${(bytes / 1024 / 1024).toFixed(2)} MiB of assets`)
