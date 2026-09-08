import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import luaparse from 'luaparse'

for (const relative of ['../fxmanifest.lua', '../config.lua', '../server/main.lua', '../client/main.lua']) {
  const file = resolve(relative)
  luaparse.parse(readFileSync(file, 'utf8'), { luaVersion: '5.3' })
  console.log(`OK ${relative}`)
}
