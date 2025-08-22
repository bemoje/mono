import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { timer } from './timer'

describe(timer.name, () => {
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleDebugSpy.mockRestore()
  })

  it('examples', () => {
    expect(() => {
      // Basic synchronous function timing
      const syncResult = timer('sync-test', () => {
        return 'sync result'
      })

      assert.strictEqual(syncResult, 'sync result', 'should return sync result')
      assert(consoleDebugSpy.mock.calls.length > 0, 'should log timing info')

      // Async function timing
      const asyncResult = timer('async-test', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'async result'
      })

      assert(asyncResult instanceof Promise, 'should return promise for async functions')

      // Function with parameters
      const paramResult = timer('param-test', (a: number, b: number) => a + b)
      assert.strictEqual(paramResult, NaN, 'should handle function parameters')
    }).not.toThrow()
  })

  describe('synchronous functions', () => {
    it('should time and return result of synchronous function', () => {
      const result = timer('sync-function', () => {
        return 42
      })

      expect(result).toBe(42)
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: 'sync-function',
          ms: expect.any(Number),
        }),
      )
    })

    it('should handle synchronous functions that return objects', () => {
      const testObject = { key: 'value', number: 123 }
      const result = timer('object-return', () => testObject)

      expect(result).toBe(testObject)
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: 'object-return',
          ms: expect.any(Number),
        }),
      )
    })

    it('should handle synchronous functions that return null/undefined', () => {
      const nullResult = timer('null-return', () => null)
      const undefinedResult = timer('undefined-return', () => undefined)

      expect(nullResult).toBeNull()
      expect(undefinedResult).toBeUndefined()
      expect(consoleDebugSpy).toHaveBeenCalledTimes(2)
    })

    it('should handle synchronous functions that throw errors', () => {
      expect(() => {
        timer('error-function', () => {
          throw new Error('Test error')
        })
      }).toThrow('Test error')

      // Should NOT log timing when function throws (timing doesn't complete)
      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })

    it('should handle functions with different return types', () => {
      const stringResult = timer('string-test', () => 'hello')
      const numberResult = timer('number-test', () => 123)
      const booleanResult = timer('boolean-test', () => true)
      const arrayResult = timer('array-test', () => [1, 2, 3])

      expect(stringResult).toBe('hello')
      expect(numberResult).toBe(123)
      expect(booleanResult).toBe(true)
      expect(arrayResult).toEqual([1, 2, 3])
      expect(consoleDebugSpy).toHaveBeenCalledTimes(4)
    })
  })

  describe('asynchronous functions', () => {
    it('should time and return result of asynchronous function', async () => {
      const result = timer('async-function', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'async result'
      })

      expect(result).toBeInstanceOf(Promise)
      const resolvedResult = await result
      expect(resolvedResult).toBe('async result')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: 'async-function',
          ms: expect.any(Number),
        }),
      )
    })

    it('should handle async functions that return objects', async () => {
      const testObject = { async: true, data: [1, 2, 3] }
      const result = await timer('async-object', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        return testObject
      })

      expect(result).toBe(testObject)
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: 'async-object',
          ms: expect.any(Number),
        }),
      )
    })

    it('should handle async functions that reject', async () => {
      const promise = timer('async-error', async () => {
        await new Promise((resolve) => setTimeout(resolve, 5))
        throw new Error('Async error')
      })

      await expect(promise).rejects.toThrow('Async error')

      // Should NOT log timing when promise rejects (timing doesn't complete)
      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })

    it('should handle functions that return resolved promises', async () => {
      const result = timer('resolved-promise', () => {
        return Promise.resolve('resolved value')
      })

      expect(result).toBeInstanceOf(Promise)
      const resolvedResult = await result
      expect(resolvedResult).toBe('resolved value')
    })

    it('should handle functions that return rejected promises', async () => {
      const result = timer('rejected-promise', () => {
        return Promise.reject(new Error('Rejected error'))
      })

      await expect(result).rejects.toThrow('Rejected error')
    })
  })

  describe('timing accuracy', () => {
    it('should measure time with reasonable accuracy', () => {
      timer('timing-test', () => {
        // Simulate some work
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }
        return sum
      })

      const call = consoleDebugSpy.mock.calls[0][0] as { timer: string; ms: number }
      expect(call.ms).toBeGreaterThan(0)
      expect(call.ms).toBeLessThan(100) // Should be very fast
    })

    it('should measure async time with reasonable accuracy', async () => {
      const delay = 20
      await timer('async-timing-test', async () => {
        await new Promise((resolve) => setTimeout(resolve, delay))
        return 'done'
      })

      const call = consoleDebugSpy.mock.calls[0][0] as { timer: string; ms: number }
      expect(call.ms).toBeGreaterThanOrEqual(delay - 5) // Allow some variance
      expect(call.ms).toBeLessThan(delay + 50) // Should not be much longer
    })
  })

  describe('timer name handling', () => {
    it('should use provided timer name in log output', () => {
      const timerName = 'custom-timer-name'
      timer(timerName, () => 'test')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: timerName,
        }),
      )
    })

    it('should handle special characters in timer names', () => {
      const specialName = 'timer-with-symbols_123.test@domain'
      timer(specialName, () => 'test')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: specialName,
        }),
      )
    })

    it('should handle empty timer names', () => {
      timer('', () => 'test')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: '',
        }),
      )
    })
  })

  describe('function parameter handling', () => {
    it('should work with functions that take parameters', () => {
      const add = (a: number, b: number) => a + b
      const result = timer('add-function', add)

      // Since no arguments are passed, parameters will be undefined
      expect(result).toBeNaN()
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          timer: 'add-function',
          ms: expect.any(Number),
        }),
      )
    })

    it('should work with functions that have complex parameter types', () => {
      const processData = (data: { items: number[] }, options: { sort: boolean }) => {
        if (!data || !options) return null
        return data.items.length
      }

      const result = timer('process-data', processData)
      expect(result).toBeNull()
    })
  })

  describe('edge cases', () => {
    it('should handle functions that return promises that resolve to undefined', async () => {
      const result = await timer('undefined-promise', async () => {
        return undefined
      })

      expect(result).toBeUndefined()
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle functions that immediately return promises', () => {
      const result = timer('immediate-promise', () => Promise.resolve('immediate'))

      expect(result).toBeInstanceOf(Promise)
    })

    it('should handle very fast operations', () => {
      timer('fast-op', () => 1 + 1)

      const call = consoleDebugSpy.mock.calls[0][0] as { timer: string; ms: number }
      expect(call.ms).toBeGreaterThanOrEqual(0)
      expect(typeof call.ms).toBe('number')
    })
  })
})
