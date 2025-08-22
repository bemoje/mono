import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { once } from './once'
import { onceSync } from './onceSync'
import { onceStrict } from './onceStrict'

describe(once.name, () => {
  it('examples', async () => {
    expect(() => {
      // Basic usage with sync function
      let count = 0
      const increment = () => ++count
      const onceIncrement = once(increment)

      const result1 = onceIncrement()
      const result2 = onceIncrement()

      assert.deepStrictEqual(result1, 1, 'first call')
      assert.deepStrictEqual(result2, 1, 'second call returns same value')
      assert.deepStrictEqual(count, 1, 'original function called only once')
    }).not.toThrow()

    // With async function
    let asyncCount = 0
    const asyncIncrement = async () => ++asyncCount
    const onceAsyncIncrement = once(asyncIncrement)

    const result = await onceAsyncIncrement()
    assert.deepStrictEqual(result, 1, 'async first call')
  })

  describe('sync function behavior', () => {
    it('should call the function only once and return the same result', () => {
      const mockFn = vi.fn(() => 'result')
      const onceFn = once(mockFn)

      const result1 = onceFn()
      const result2 = onceFn()
      const result3 = onceFn()

      expect(result1).toBe('result')
      expect(result2).toBe('result')
      expect(result3).toBe('result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to the original function', () => {
      const mockFn = vi.fn((a: number, b: string) => `${a}-${b}`)
      const onceFn = once(mockFn)

      const result1 = onceFn(42, 'test')
      const result2 = onceFn(99, 'ignored')

      expect(result1).toBe('42-test')
      expect(result2).toBe('42-test')
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(42, 'test')
    })

    it('should preserve this context', () => {
      const obj = {
        value: 'test',
        getValue() {
          return this.value
        },
      }

      const onceGetValue = once(obj.getValue)
      const result = onceGetValue.call(obj)

      expect(result).toBe('test')
    })
  })

  describe('async function behavior', () => {
    it('should call async function only once', async () => {
      const mockFn = vi.fn(async () => 'async result')
      const onceFn = once(mockFn)

      const result1 = await onceFn()
      const result2 = await onceFn()
      const result3 = await onceFn()

      expect(result1).toBe('async result')
      expect(result2).toBe('async result')
      expect(result3).toBe('async result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle async function that throws', async () => {
      const error = new Error('test error')
      const mockFn = vi.fn(async () => {
        throw error
      })
      const onceFn = once(mockFn)

      await expect(onceFn()).rejects.toThrow(error)
      await expect(onceFn()).rejects.toThrow(error)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('function name preservation', () => {
    it('should preserve the original function name', () => {
      function namedFunction() {
        return 'result'
      }

      const onceFn = once(namedFunction)
      expect(onceFn.name).toBe('namedFunction')
    })
  })
})

describe(onceStrict.name, () => {
  it('examples', async () => {
    let count = 0
    const increment = async () => ++count
    const onceStrictIncrement = onceStrict(increment)

    // First call should work
    const result = await onceStrictIncrement()
    assert.deepStrictEqual(result, 1, 'first call')

    // Second call should throw
    try {
      await onceStrictIncrement()
      assert.fail('should have thrown')
    } catch (error) {
      assert.ok(error instanceof Error, 'should throw error')
    }
  })

  describe('strict behavior', () => {
    it('should throw error on second call', async () => {
      const mockFn = vi.fn(async () => 'result')
      const onceStrictFn = onceStrict(mockFn)

      const result = await onceStrictFn()
      expect(result).toBe('result')

      await expect(onceStrictFn()).rejects.toThrow('Function has already been called')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should include function name in error message', async () => {
      async function namedFunction() {
        return 'result'
      }

      const onceStrictFn = onceStrict(namedFunction)
      await onceStrictFn()

      await expect(onceStrictFn()).rejects.toThrow('Function has already been called: namedFunction')
    })
  })
})

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
