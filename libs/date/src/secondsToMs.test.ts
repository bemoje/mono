import { describe, it, expect } from 'vitest'
import { secondsToMs } from './secondsToMs'

describe(secondsToMs.name, () => {
  it('should convert hours to milliseconds', () => {
    expect(secondsToMs(3)).toBe(1000 * 3)
  })

  it('should handle zero', () => {
    expect(secondsToMs(0)).toBe(0)
  })

  it('should handle floats', () => {
    expect(secondsToMs(2.5)).toBe(1000 * 2.5)
  })
})
