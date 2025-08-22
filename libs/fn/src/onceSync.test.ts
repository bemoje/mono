import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { onceSync } from './onceSync'

describe(onceSync.name, () => {
  it('examples', () => {
    expect(() => {
      let count = 0
      const increment = () => ++count
      const onceSyncIncrement = onceSync(increment)

      const result1 = onceSyncIncrement()
      const result2 = onceSyncIncrement()

      assert.deepStrictEqual(result1, 1, 'first call')
      assert.deepStrictEqual(result2, 1, 'second call returns same value')
    }).not.toThrow()
  })

  describe('sync-only behavior', () => {
    it('should work with sync functions only', () => {
      const mockFn = vi.fn(() => 'sync result')
      const onceSyncFn = onceSync(mockFn)

      const result1 = onceSyncFn()
      const result2 = onceSyncFn()

      expect(result1).toBe('sync result')
      expect(result2).toBe('sync result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle sync function that throws', () => {
      const error = new Error('sync error')
      const mockFn = vi.fn(() => {
        throw error
      })
      const onceSyncFn = onceSync(mockFn)

      expect(() => onceSyncFn()).toThrow(error)
      // Second call should return the stored error result, but since it threw,
      // the onceSync function stores the thrown error and will throw again
      expect(() => onceSyncFn()).toThrow(error)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
