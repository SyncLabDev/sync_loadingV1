import { useScrambleText } from '../hooks/useScrambleText'

interface Props {
  text: string
  triggerKey: string | number
  duration?: number
  delay?: number
  enabled?: boolean
  intensity?: 'subtle' | 'hero'
  className?: string
}

export function ScrambleText({ text, triggerKey, duration = 420, delay = 0, enabled = true, intensity = 'subtle', className = '' }: Props) {
  const displayText = useScrambleText({ text, triggerKey, duration, delay, enabled })
  const characterCount = Math.max(1, Array.from(text).length)

  return <span className={`scramble-text scramble-${intensity} ${className}`.trim()} style={{ minWidth: `${characterCount}ch` }}>
    <span className="scramble-text__accessible">{text}</span>
    <span className="scramble-text__glyphs" aria-hidden="true">{displayText}</span>
  </span>
}
