import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { maxConcurrency } from './maxConcurrency'

describe(maxConcurrency.name, () => {
  it('examples', async () => {
    // Basic usage - limit to 2 concurrent executions
    let currentlyRunning = 0
    let maxConcurrentSeen = 0

    const slowTask = async (id: number) => {
      currentlyRunning++
      maxConcurrentSeen = Math.max(maxConcurrentSeen, currentlyRunning)

      await new Promise((resolve) => setTimeout(resolve, 50))

      currentlyRunning--
      return `task-${id}`
    }

    const limitedTask = maxConcurrency(slowTask, 2)

    // Start 5 tasks simultaneously
    const promises = Array.from({ length: 5 }, (_, i) => limitedTask(i))
    const results = await Promise.all(promises)

    assert.deepStrictEqual(maxConcurrentSeen, 2, 'max concurrency respected')
    assert.deepStrictEqual(results.length, 5, 'all tasks completed')
  })

  describe('concurrency limiting', () => {
    it('should limit concurrent executions to specified number', async () => {
      let runningCount = 0
      let maxConcurrent = 0

      const task = vi.fn(async (delay: number) => {
        runningCount++
        maxConcurrent = Math.max(maxConcurrent, runningCount)

        await new Promise((resolve) => setTimeout(resolve, delay))

        runningCount--
        return delay
      })

      const limitedTask = maxConcurrency(task, 3)

      // Start 6 tasks
      const promises = [
        limitedTask(50),
        limitedTask(50),
        limitedTask(50),
        limitedTask(50),
        limitedTask(50),
        limitedTask(50),
      ]

      await Promise.all(promises)

      expect(maxConcurrent).toBe(3)
      expect(task).toHaveBeenCalledTimes(6)
    })

    it('should accept options object', async () => {
      let runningCount = 0
      let maxConcurrent = 0

      const task = async () => {
        runningCount++
        maxConcurrent = Math.max(maxConcurrent, runningCount)
        await new Promise((resolve) => setTimeout(resolve, 30))
        runningCount--
        return 'done'
      }

      const limitedTask = maxConcurrency(task, { concurrency: 2 })

      const promises = Array.from({ length: 4 }, () => limitedTask())
      await Promise.all(promises)

      expect(maxConcurrent).toBe(2)
    })
  })

  describe('argument passing', () => {
    it('should preserve function arguments', async () => {
      const task = vi.fn(async (a: string, b: number, c: boolean) => {
        return { a, b, c }
      })

      const limitedTask = maxConcurrency(task, 1)

      const result = await limitedTask('test', 42, true)

      expect(result).toEqual({ a: 'test', b: 42, c: true })
      expect(task).toHaveBeenCalledWith('test', 42, true)
    })

    it('should handle tasks with no arguments', async () => {
      const task = vi.fn(async () => 'no-args')
      const limitedTask = maxConcurrency(task, 1)

      const result = await limitedTask()

      expect(result).toBe('no-args')
      expect(task).toHaveBeenCalledWith()
    })

    it('should handle tasks with multiple different argument types', async () => {
      const task = vi.fn(async (obj: object, arr: number[], fn: () => string) => {
        return {
          objKeys: Object.keys(obj),
          arrSum: arr.reduce((a, b) => a + b, 0),
          fnResult: fn(),
        }
      })

      const limitedTask = maxConcurrency(task, 1)

      const testObj = { a: 1, b: 2 }
      const testArr = [1, 2, 3]
      const testFn = () => 'test'

      const result = await limitedTask(testObj, testArr, testFn)

      expect(result).toEqual({
        objKeys: ['a', 'b'],
        arrSum: 6,
        fnResult: 'test',
      })
    })
  })

  describe('error handling', () => {
    it('should propagate errors from tasks', async () => {
      const error = new Error('Task failed')
      const task = vi.fn(async () => {
        throw error
      })

      const limitedTask = maxConcurrency(task, 1)

      await expect(limitedTask()).rejects.toThrow(error)
      expect(task).toHaveBeenCalledTimes(1)
    })

    it('should handle mixed success and failure', async () => {
      const task = vi.fn(async (shouldFail: boolean) => {
        if (shouldFail) {
          throw new Error('Failed')
        }
        return 'success'
      })

      const limitedTask = maxConcurrency(task, 2)

      const results = await Promise.allSettled([limitedTask(false), limitedTask(true), limitedTask(false)])

      expect(results[0]).toEqual({ status: 'fulfilled', value: 'success' })
      expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) })
      expect(results[2]).toEqual({ status: 'fulfilled', value: 'success' })
    })
  })

  describe('return values', () => {
    it('should preserve return values of different types', async () => {
      const stringTask = maxConcurrency(async () => 'string', 1)
      const numberTask = maxConcurrency(async () => 42, 1)
      const objectTask = maxConcurrency(async () => ({ key: 'value' }), 1)
      const arrayTask = maxConcurrency(async () => [1, 2, 3], 1)

      expect(await stringTask()).toBe('string')
      expect(await numberTask()).toBe(42)
      expect(await objectTask()).toEqual({ key: 'value' })
      expect(await arrayTask()).toEqual([1, 2, 3])
    })

    it('should handle undefined and null returns', async () => {
      const undefinedTask = maxConcurrency(async () => undefined, 1)
      const nullTask = maxConcurrency(async () => null, 1)

      expect(await undefinedTask()).toBeUndefined()
      expect(await nullTask()).toBeNull()
    })
  })
})
