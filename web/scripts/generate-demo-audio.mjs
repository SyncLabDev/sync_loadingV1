import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const sampleRate = 22050
const seconds = 24
const samples = sampleRate * seconds
const dataSize = samples * 2
const buffer = Buffer.alloc(44 + dataSize)

buffer.write('RIFF', 0)
buffer.writeUInt32LE(36 + dataSize, 4)
buffer.write('WAVE', 8)
buffer.write('fmt ', 12)
buffer.writeUInt32LE(16, 16)
buffer.writeUInt16LE(1, 20)
buffer.writeUInt16LE(1, 22)
buffer.writeUInt32LE(sampleRate, 24)
buffer.writeUInt32LE(sampleRate * 2, 28)
buffer.writeUInt16LE(2, 32)
buffer.writeUInt16LE(16, 34)
buffer.write('data', 36)
buffer.writeUInt32LE(dataSize, 40)

let noise = 0
for (let index = 0; index < samples; index += 1) {
  const time = index / sampleRate
  const fade = Math.min(1, time / 3, (seconds - time) / 3)
  noise = noise * .996 + (Math.random() * 2 - 1) * .004
  const pad = Math.sin(time * Math.PI * 2 * 55) * .21 + Math.sin(time * Math.PI * 2 * 82.5 + .7) * .12 + Math.sin(time * Math.PI * 2 * 110 + 1.8) * .07
  const tide = Math.sin(time * Math.PI * 2 / 12) * .5 + .5
  const sample = Math.max(-1, Math.min(1, (pad * (.45 + tide * .25) + noise * .11) * fade))
  buffer.writeInt16LE(Math.round(sample * 32767), 44 + index * 2)
}

const output = resolve('public/assets/audio/horizon-drift.wav')
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, buffer)
console.log(`Generated ${output} (${Math.round(buffer.length / 1024)} KiB)`)
