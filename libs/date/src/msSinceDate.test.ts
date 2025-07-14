import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { msSinceDate } from './msSinceDate'

describe(msSinceDate.name, () => {
  beforeAll(() => vi.useFakeTimers())
  afterAll(() => vi.useRealTimers())

  it('should return the correct milliseconds for a Date object', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 1000) // 1 second ago
    expect(msSinceDate(pastDate)).toBeCloseTo(1000, -2)
  })

  it('should return the correct milliseconds for a date string', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 2000).toISOString() // 2 seconds ago
    expect(msSinceDate(pastDate)).toBeCloseTo(2000, -2)
  })

  it('should return the correct milliseconds for a timestamp', () => {
    const now = Date.now()
    const pastTimestamp = now - 3000 // 3 seconds ago
    expect(msSinceDate(pastTimestamp)).toBeCloseTo(3000, -2)
  })

  it('should handle future dates correctly', () => {
    const futureDate = new Date(Date.now() + 1000) // 1 second in the future
    expect(msSinceDate(futureDate)).toBeLessThan(0)
  })
})
