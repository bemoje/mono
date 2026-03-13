import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterIterableEntries } from './filterIterableEntries'
import { it } from 'vitest'

describe(filterIterableEntries.name, () => {
  it('examples', () => {
    expect(() => {
      // filter entries by value
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const filtered = [
        ...filterIterableEntries(entries, ([key, value]) => {
          return value > 1
        }),
      ]
      assert.deepStrictEqual(
        filtered,
        [
          ['b', 2],
          ['c', 3],
        ],
        'filtered by value'
      )

      // filter entries by key
      const filtered2 = [
        ...filterIterableEntries(entries, ([key, value]) => {
          return key !== 'b'
        }),
      ]
      assert.deepStrictEqual(
        filtered2,
        [
          ['a', 1],
          ['c', 3],
        ],
        'filtered by key'
      )

      // empty result
      const empty = [
        ...filterIterableEntries(entries, () => {
          return false
        }),
      ]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]
    const result = [
      ...filterIterableEntries(entries, ([_, value]) => {
        return value % 2 === 0
      }),
    ]
    expect(result).toEqual([
      ['b', 2],
      ['d', 4],
    ])
  })

  it('should filter based on key', () => {
    const entries: Array<[string, number]> = [
      ['apple', 1],
      ['banana', 2],
      ['apricot', 3],
    ]
    const result = [
      ...filterIterableEntries(entries, ([key, _]) => {
        return key.startsWith('a')
      }),
    ]
    expect(result).toEqual([
      ['apple', 1],
      ['apricot', 3],
    ])
  })

  it('should filter based on combined key-value predicate', () => {
    const entries: Array<[string, number]> = [
      ['a', 10],
      ['b', 20],
      ['c', 30],
    ]
    const result = [
      ...filterIterableEntries(entries, ([key, value]) => {
        return value > 15 && key !== 'c'
      }),
    ]
    expect(result).toEqual([['b', 20]])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...filterIterableEntries([], () => {
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
      ...filterIterableEntries(entries, ([_, value]) => {
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
      ...filterIterableEntries(map, ([_, value]) => {
        return value >= 200
      }),
    ]
    expect(result).toEqual([
      ['y', 200],
      ['z', 300],
    ])
  })

  it('should work with different types', () => {
    const entries: Array<[number, string]> = [
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ]
    const result = [
      ...filterIterableEntries(entries, ([key, _]) => {
        return key % 2 === 1
      }),
    ]
    expect(result).toEqual([
      [1, 'one'],
      [3, 'three'],
    ])
  })
})
