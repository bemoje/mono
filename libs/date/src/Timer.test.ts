import { describe, it, expect } from 'vitest'
import { Timer } from './Timer'

describe(Timer.name, () => {
  it('should return the elapsed time as a string in milliseconds', () => {
    const start = Date.now()
    const timer = Timer(start)
    const end = start + 500
    const result = timer(end)
    expect(result).toMatch(/500ms/)
  })
  it('should return the elapsed time as a string in seconds', () => {
    const start = Date.now()
    const timer = Timer(start)
    const end = start + 2000
    const result = timer(end)
    expect(result).toMatch(/2s/)
  })

  it('should default to current time if no startTime is provided', () => {
    const timer = Timer()
    const result = timer(Date.now())
    expect(result).toMatch(/\d+ms/)
  })

  it('should return 0 ms if endTime equals startTime', () => {
    const start = Date.now()
    const timer = Timer(start)
    const result = timer(start)
    expect(result).toBe('0ms')
  })

  it('should return the elapsed time using the current time as default endTime', () => {
    const start = Date.now()
    const timer = Timer(start)
    const result = timer()
    expect(result).toMatch(/^\d+ms$/)
  })
})
