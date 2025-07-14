import { describe, it, expect } from 'vitest'
import { daysToMs } from './daysToMs'

describe(daysToMs.name, () => {
  it('should convert hours to milliseconds', () => {
    expect(daysToMs(3)).toBe(1000 * 60 * 60 * 24 * 3)
  })

  it('should handle zero', () => {
    expect(daysToMs(0)).toBe(0)
  })

  it('should handle floats', () => {
    expect(daysToMs(2.5)).toBe(1000 * 60 * 60 * 24 * 2.5)
  })
})
