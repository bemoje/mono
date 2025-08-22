import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { reduceIterable } from './reduceIterable'

describe(reduceIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // sum all values
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const sum = reduceIterable(entries, (acc, value) => acc + value, 0)
      assert.strictEqual(sum, 6, 'sum calculated')

      // collect all keys
      const keys = reduceIterable(entries, (acc, value, key) => [...acc, key], [] as string[])
      assert.deepStrictEqual(keys, ['a', 'b', 'c'], 'keys collected')

      // create object from entries
      const obj = reduceIterable(
        entries,
        (acc, value, key) => ({ ...acc, [key]: value }),
        {} as Record<string, number>,
      )
      assert.deepStrictEqual(obj, { a: 1, b: 2, c: 3 }, 'object created')
    }).not.toThrow()
  })

  it('should reduce to sum of values', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
      ['z', 30],
    ]
    const result = reduceIterable(entries, (acc, value) => acc + value, 0)
    expect(result).toBe(60)
  })

  it('should reduce using both keys and values', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]
    const result = reduceIterable(entries, (acc, value, key) => acc + key.repeat(value), '')
    expect(result).toBe('abbccc')
  })

  it('should build an array from entries', () => {
    const entries: Array<[string, number]> = [
      ['first', 10],
      ['second', 20],
    ]
    const result = reduceIterable(entries, (acc, value, key) => [...acc, `${key}:${value}`], [] as string[])
    expect(result).toEqual(['first:10', 'second:20'])
  })

  it('should handle empty iterable', () => {
    const result = reduceIterable([], (acc: number, value: any) => acc + value, 42)
    expect(result).toBe(42)
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['a', 5],
      ['b', 10],
      ['c', 15],
    ])
    const result = reduceIterable(map, (acc, value) => Math.max(acc, value), 0)
    expect(result).toBe(15)
  })

  it('should build complex objects', () => {
    const entries: Array<[string, { count: number; active: boolean }]> = [
      ['item1', { count: 5, active: true }],
      ['item2', { count: 10, active: false }],
      ['item3', { count: 15, active: true }],
    ]

    const result = reduceIterable(
      entries,
      (acc, value, key) => {
        if (value.active) {
          acc.activeItems.push(key)
          acc.totalActiveCount += value.count
        }
        return acc
      },
      { activeItems: [] as string[], totalActiveCount: 0 },
    )

    expect(result).toEqual({
      activeItems: ['item1', 'item3'],
      totalActiveCount: 20,
    })
  })

  it('should maintain reducer state correctly', () => {
    const entries: Array<[number, string]> = [
      [1, 'first'],
      [2, 'second'],
      [3, 'third'],
    ]
    const result = reduceIterable(
      entries,
      (acc, value, key) => {
        acc.count++
        acc.keySum += key
        acc.values.push(value)
        return acc
      },
      { count: 0, keySum: 0, values: [] as string[] },
    )

    expect(result).toEqual({
      count: 3,
      keySum: 6,
      values: ['first', 'second', 'third'],
    })
  })
})
