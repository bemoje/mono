import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachIterable } from './forEachIterable'
import { it } from 'vitest'

describe(forEachIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate numbers
      const numbers = [1, 2, 3, 4, 5]
      const results: number[] = []
      forEachIterable(numbers, (n) => {
        results.push(n * 2)
      })
      assert.deepStrictEqual(results, [2, 4, 6, 8, 10], 'forEach with transformation')
    }).not.toThrow()
  })

  it('should execute callback for each element', () => {
    const values = [1, 2, 3, 4]
    const results: number[] = []
    forEachIterable(values, (v) => {
      results.push(v)
    })
    expect(results).toEqual([1, 2, 3, 4])
  })

  it('should handle empty iterable', () => {
    let called = false
    forEachIterable([], () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with Set', () => {
    const set = new Set([1, 2, 3])
    const results: number[] = []
    forEachIterable(set, (value) => {
      results.push(value)
    })
    expect(results).toEqual([1, 2, 3])
  })

  it('should work with Map values', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const results: Array<[string, number]> = []
    forEachIterable(map, (entry) => {
      results.push(entry)
    })
    expect(results).toEqual([
      ['a', 1],
      ['b', 2],
    ])
  })

  it('should allow side effects', () => {
    let sum = 0
    forEachIterable([1, 2, 3, 4], (value) => {
      sum += value
    })
    expect(sum).toBe(10)
  })
})
