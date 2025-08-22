import { memoryUsage } from './memoryUsage'
import { describe, expect, it } from 'vitest'

describe(memoryUsage.name, () => {
  it('should get memory usage values', () => {
    const m = memoryUsage()
    expect(typeof m.rss).toBe('number')
    expect(typeof m.heapTotal).toBe('number')
    expect(typeof m.heapUsed).toBe('number')
    expect(typeof m.external).toBe('number')
    expect(typeof m.arrayBuffers).toBe('number')
  })

  it('should set the decimal point precision as requested', () => {
    const m = memoryUsage(0)
    expect(Number.isInteger(m.rss)).toBe(true)
    expect(Number.isInteger(m.heapTotal)).toBe(true)
    expect(Number.isInteger(m.heapUsed)).toBe(true)
    expect(Number.isInteger(m.external)).toBe(true)
    expect(Number.isInteger(m.arrayBuffers)).toBe(true)
  })
})
