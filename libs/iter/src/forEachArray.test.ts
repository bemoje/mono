import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachArray } from './forEachArray'
import { it } from 'vitest'

describe(forEachArray.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate numbers
      const numbers = [1, 2, 3, 4, 5]
      const results: number[] = []
      forEachArray(numbers, (n) => {
        results.push(n * 2)
      })
      assert.deepStrictEqual(results, [2, 4, 6, 8, 10], 'forEach with transformation')

      // iterate with index
      const indices: number[] = []
      forEachArray(numbers, (n, index) => {
        indices.push(index)
      })
      assert.deepStrictEqual(indices, [0, 1, 2, 3, 4], 'forEach with index')
    }).not.toThrow()
  })

  it('should execute callback for each element', () => {
    const array = [1, 2, 3, 4, 5]
    const results: number[] = []
    forEachArray(array, (value) => {
      results.push(value)
    })
    expect(results).toEqual([1, 2, 3, 4, 5])
  })

  it('should provide index to callback', () => {
    const array = ['a', 'b', 'c']
    const results: Array<[string, number]> = []
    forEachArray(array, (value, index) => {
      results.push([value, index])
    })
    expect(results).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ])
  })

  it('should handle empty array', () => {
    let called = false
    forEachArray([], () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with readonly arrays', () => {
    const array: readonly number[] = [1, 2, 3]
    const results: number[] = []
    forEachArray(array, (value) => {
      results.push(value)
    })
    expect(results).toEqual([1, 2, 3])
  })

  it('should work with complex objects', () => {
    const array = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const results: string[] = []
    forEachArray(array, (item) => {
      results.push(item.name)
    })
    expect(results).toEqual(['Alice', 'Bob'])
  })

  it('should allow side effects', () => {
    let sum = 0
    forEachArray([1, 2, 3, 4], (value) => {
      sum += value
    })
    expect(sum).toBe(10)
  })
})
