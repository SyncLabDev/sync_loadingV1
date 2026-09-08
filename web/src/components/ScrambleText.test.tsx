import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrambleText } from './ScrambleText'

const motionPreference = (matches: boolean) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('ScrambleText', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => motionPreference(false)))
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16))
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => window.clearTimeout(handle))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('keeps the final text available to assistive technology while animating', () => {
    const { container } = render(<ScrambleText text="SYSTEM READY" triggerKey="ready" duration={120} />)
    expect(container.querySelector('.scramble-text__accessible')).toHaveTextContent('SYSTEM READY')
    expect(container.querySelector('.scramble-text__glyphs')).toHaveAttribute('aria-hidden', 'true')
  })

  it('resolves deterministically to the final text', () => {
    const { container } = render(<ScrambleText text="SYNC ESTABLISHED" triggerKey="complete" duration={120} />)
    act(() => vi.advanceTimersByTime(200))
    expect(container.querySelector('.scramble-text__glyphs')).toHaveTextContent('SYNC ESTABLISHED')
  })

  it('skips animation when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => motionPreference(true)))
    const { container } = render(<ScrambleText text="ENTERING CITY" triggerKey="complete" duration={720} />)
    expect(container.querySelector('.scramble-text__glyphs')).toHaveTextContent('ENTERING CITY')
    expect(vi.getTimerCount()).toBe(0)
  })
})
