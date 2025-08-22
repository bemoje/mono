import { describe, expect, it } from 'vitest'
import { stripTime } from './stripTime'

describe('stripTime', () => {
  it('should be defined', () => {
    expect(stripTime).toBeDefined()
  })

  it('should return a Date object', () => {
    const date = new Date()
    const result = stripTime(date)
    expect(result).toBeInstanceOf(Date)
  })

  it('should strip the time part of a date', () => {
    const date = new Date(2025, 0, 15, 13, 45, 30) // January 15, 2025, 13:45:30
    const result = stripTime(date)

    expect(result.toISOString()).toBe('2025-01-15T00:00:00.000Z')
  })

  it('should handle dates with only the date part set (no time)', () => {
    const date = new Date('2025-01-15') // January 15, 2025, 00:00:00
    const result = stripTime(date)

    expect(result.toISOString()).toBe('2025-01-15T00:00:00.000Z')
  })

  it('should not mutate the original date', () => {
    const date = new Date(2025, 0, 15, 13, 45, 30) // January 15, 2025, 13:45:30
    const originalDate = new Date(date.getTime())

    stripTime(date)

    expect(date.getTime()).toBe(originalDate.getTime())
  })

  it('should work with dates in different time zones', () => {
    const date = new Date('2025-01-15T23:59:59Z') // January 15, 2025, 23:59:59 UTC
    const result = stripTime(date)

    expect(result.getUTCFullYear()).toBe(2025)
    expect(result.getUTCMonth()).toBe(0) // January is month 0
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(0)
    expect(result.getUTCMinutes()).toBe(0)
    expect(result.getUTCSeconds()).toBe(0)
    expect(result.getUTCMilliseconds()).toBe(0)
  })
})
