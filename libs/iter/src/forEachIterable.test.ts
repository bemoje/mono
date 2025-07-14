import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { forEachIterable } from './forEachIterable'

describe(forEachIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // collect values and keys
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const values: number[] = []
      const keys: string[] = []

      forEachIterable(entries, (value, key) => {
        values.push(value)
        keys.push(key)
      })

      assert.deepStrictEqual(values, [1, 2, 3], 'values collected')
      assert.deepStrictEqual(keys, ['a', 'b', 'c'], 'keys collected')

      // side effects
      let sum = 0
      forEachIterable(entries, (value) => {
        sum += value
      })
      assert.strictEqual(sum, 6, 'sum calculated')
    }).not.toThrow()
  })

  it('should iterate over all entries', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
      ['z', 30],
    ]
    const results: Array<[string, number]> = []

    forEachIterable(entries, (value, key) => {
      results.push([key, value])
    })

    expect(results).toEqual([
      ['x', 10],
      ['y', 20],
      ['z', 30],
    ])
  })

  it('should handle empty iterable', () => {
    let callCount = 0
    forEachIterable([], () => {
      callCount++
    })
    expect(callCount).toBe(0)
  })

  it('should execute callback for each entry in correct order', () => {
    const entries: Array<[number, string]> = [
      [1, 'first'],
      [2, 'second'],
      [3, 'third'],
    ]
    const order: number[] = []

    forEachIterable(entries, (value, key) => {
      order.push(key)
    })

    expect(order).toEqual([1, 2, 3])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['a', 100],
      ['b', 200],
    ])
    const collected: Array<[string, number]> = []

    forEachIterable(map, (value, key) => {
      collected.push([key, value])
    })

    expect(collected).toEqual([
      ['a', 100],
      ['b', 200],
    ])
  })

  it('should allow side effects', () => {
    const entries: Array<[string, number]> = [
      ['a', 5],
      ['b', 10],
      ['c', 15],
    ]
    let total = 0
    let keyCount = 0

    forEachIterable(entries, (value, key) => {
      total += value
      keyCount++
    })

    expect(total).toBe(30)
    expect(keyCount).toBe(3)
  })
})
