import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachIterableValues } from './forEachIterableValues'
import { it } from 'vitest'

describe(forEachIterableValues.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate values
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const values: number[] = []
      forEachIterableValues(entries, (value) => {
        values.push(value)
      })
      assert.deepStrictEqual(values, [1, 2, 3], 'forEach values')
    }).not.toThrow()
  })

  it('should execute callback for each value', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]
    const values: number[] = []
    forEachIterableValues(entries, (value) => {
      values.push(value)
    })
    expect(values).toEqual([1, 2, 3])
  })

  it('should provide both value and key', () => {
    const entries: Array<[string, number]> = [
      ['a', 10],
      ['b', 20],
    ]
    const results: Array<[number, string]> = []
    forEachIterableValues(entries, (value, key) => {
      results.push([value, key])
    })
    expect(results).toEqual([
      [10, 'a'],
      [20, 'b'],
    ])
  })

  it('should handle empty iterable', () => {
    let called = false
    forEachIterableValues([], () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['x', 100],
      ['y', 200],
    ])
    const values: number[] = []
    forEachIterableValues(map, (value) => {
      values.push(value)
    })
    expect(values).toEqual([100, 200])
  })

  it('should allow side effects', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]
    let sum = 0
    forEachIterableValues(entries, (value) => {
      sum += value
    })
    expect(sum).toBe(6)
  })
})
