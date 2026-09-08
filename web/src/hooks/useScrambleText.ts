import { useEffect, useState } from 'react'

const defaultGlyphs = '01/<>-_[]{}+='

interface Options {
  text: string
  triggerKey: string | number
  duration: number
  delay?: number
  enabled?: boolean
  glyphs?: string
}

export function useScrambleText({ text, triggerKey, duration, delay = 0, enabled = true, glyphs = defaultGlyphs }: Options) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!enabled || media?.matches || duration <= 0 || !text) {
      setDisplayText(text)
      return
    }

    const characters = Array.from(text)
    const pool = Array.from(glyphs || defaultGlyphs)
    let frameHandle: number | undefined
    let delayHandle: number | undefined
    let usesAnimationFrame = false
    let startedAt: number | undefined
    let cancelled = false

    const cancelFrame = () => {
      if (frameHandle === undefined) return
      if (usesAnimationFrame) window.cancelAnimationFrame(frameHandle)
      else window.clearTimeout(frameHandle)
      frameHandle = undefined
    }

    const schedule = (callback: FrameRequestCallback) => {
      if (typeof window.requestAnimationFrame === 'function') {
        usesAnimationFrame = true
        frameHandle = window.requestAnimationFrame(callback)
      } else {
        usesAnimationFrame = false
        frameHandle = window.setTimeout(() => callback(performance.now()), 16)
      }
    }

    const draw = (timestamp: number) => {
      if (cancelled) return
      startedAt ??= timestamp
      const elapsed = timestamp - startedAt
      const progress = Math.min(1, elapsed / duration)
      const resolved = Math.floor(progress * (characters.length + 1))
      const frame = Math.floor(elapsed / 34)
      const next = characters.map((character, index) => {
        if (/\s/.test(character) || index < resolved) return character
        const seed = frame * 7 + index * 13 + character.charCodeAt(0)
        return pool[seed % pool.length]
      }).join('')

      setDisplayText(progress >= 1 ? text : next)
      if (progress < 1) schedule(draw)
    }

    const begin = () => schedule(draw)
    if (delay > 0) delayHandle = window.setTimeout(begin, delay)
    else begin()

    const motionChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      cancelFrame()
      if (delayHandle !== undefined) window.clearTimeout(delayHandle)
      setDisplayText(text)
    }
    media?.addEventListener?.('change', motionChange)

    return () => {
      cancelled = true
      cancelFrame()
      if (delayHandle !== undefined) window.clearTimeout(delayHandle)
      media?.removeEventListener?.('change', motionChange)
    }
  }, [delay, duration, enabled, glyphs, text, triggerKey])

  return displayText
}
