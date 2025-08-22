import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { hasCooldownElapsed } from './hasCooldownElapsed'

describe('hasCooldownElapsed', () => {
  it('should be defined', () => {
    expect(hasCooldownElapsed).toBeDefined()
  })

  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should return true if the cooldown has elapsed', () => {
    const startDate = new Date(Date.now() - 5000) // 5 seconds ago
    const cooldownMs = 3000 // 3 seconds cooldown
    expect(hasCooldownElapsed(startDate, cooldownMs)).toBe(true)
  })

  it('should return false if the cooldown has not elapsed', () => {
    const startDate = new Date(Date.now() - 2000) // 2 seconds ago
    const cooldownMs = 3000 // 3 seconds cooldown
    expect(hasCooldownElapsed(startDate, cooldownMs)).toBe(false)
  })

  it('should return false if the start date is in the future', () => {
    const startDate = new Date(Date.now() + 1000) // 1 second in the future
    const cooldownMs = 3000 // 3 seconds cooldown
    expect(hasCooldownElapsed(startDate, cooldownMs)).toBe(false)
  })

  it('should handle edge case where cooldown equals elapsed time', () => {
    const startDate = new Date(Date.now() - 3000) // Exactly 3 seconds ago
    const cooldownMs = 3000 // 3 seconds cooldown
    expect(hasCooldownElapsed(startDate, cooldownMs)).toBe(false)
  })
})
