import { describe, it, expect } from 'vitest'
import { minutesToMs } from './minutesToMs'

describe(minutesToMs.name, () => {
  it('should convert hours to milliseconds', () => {
    expect(minutesToMs(3)).toBe(1000 * 60 * 3)
  })

  it('should handle zero', () => {
    expect(minutesToMs(0)).toBe(0)
  })

  it('should handle floats', () => {
    expect(minutesToMs(2.5)).toBe(1000 * 60 * 2.5)
  })
})
