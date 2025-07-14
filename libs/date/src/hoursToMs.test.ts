import { describe, it, expect } from 'vitest'
import { hoursToMs } from './hoursToMs'

describe(hoursToMs.name, () => {
  it('should convert hours to milliseconds', () => {
    expect(hoursToMs(3)).toBe(1000 * 60 * 60 * 3)
  })

  it('should handle zero', () => {
    expect(hoursToMs(0)).toBe(0)
  })

  it('should handle floats', () => {
    expect(hoursToMs(2.5)).toBe(1000 * 60 * 60 * 2.5)
  })
})
