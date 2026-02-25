import assert from 'node:assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterIterable } from './filterIterable'
import { it } from 'vitest'

describe(filterIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // filter map entries by value
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const filtered = [
        ...filterIterable(entries, (value) => {
          return value > 1
        }),
      ]
      assert.deepStrictEqual(
        filtered,
        [
          ['b', 2],
          ['c', 3],
        ],
        'filtered by value',
      )

      // filter by key
      const filtered2 = [
        ...filterIterable(entries, (value, key) => {
          return key !== 'b'
        }),
      ]
      assert.deepStrictEqual(
        filtered2,
        [
          ['a', 1],
          ['c', 3],
        ],
        'filtered by key',
      )

      // empty result
      const empty = [
        ...filterIterable(entries, () => {
          return false
        }),
      ]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value predicate', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]
    const result = [
      ...filterIterable(entries, (value) => {
        return value % 2 === 0
      }),
    ]
    expect(result).toEqual([
      ['b', 2],
      ['d', 4],
    ])
  })

  it('should filter based on key predicate', () => {
    const entries: Array<[string, number]> = [
      ['apple', 1],
      ['banana', 2],
      ['cherry', 3],
    ]
    const result = [
      ...filterIterable(entries, (value, key) => {
        return key.startsWith('a')
      }),
    ]
    expect(result).toEqual([['apple', 1]])
  })

  it('should filter based on combined key-value predicate', () => {
    const entries: Array<[string, number]> = [
      ['a', 10],
      ['b', 20],
      ['c', 30],
    ]
    const result = [
      ...filterIterable(entries, (value, key) => {
        return value > 15 && key !== 'c'
      }),
    ]
    expect(result).toEqual([['b', 20]])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...filterIterable([], () => {
        return true
      }),
    ]
    expect(result).toEqual([])
  })

  it('should return empty when no items match', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
    ]
    const result = [
      ...filterIterable(entries, (value) => {
        return value > 10
      }),
    ]
    expect(result).toEqual([])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['x', 100],
      ['y', 200],
      ['z', 300],
    ])
    const result = [
      ...filterIterable(map, (value) => {
        return value >= 200
      }),
    ]
    expect(result).toEqual([
      ['y', 200],
      ['z', 300],
    ])
  })
})
