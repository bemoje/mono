import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterIterableKeys } from './filterIterableKeys'
import { it } from 'vitest'

describe(filterIterableKeys.name, () => {
  it('examples', () => {
    expect(() => {
      // filter by key only
      const entries: Array<[string, number]> = [
        ['apple', 1],
        ['banana', 2],
        ['apricot', 3],
      ]
      const filtered = [
        ...filterIterableKeys(entries, (key) => {
          return key.startsWith('a')
        }),
      ]
      assert.deepStrictEqual(
        filtered,
        [
          ['apple', 1],
          ['apricot', 3],
        ],
        'filtered by key'
      )

      // filter by key and value
      const filtered2 = [
        ...filterIterableKeys(entries, (key, value) => {
          return key.length > 5 && value > 1
        }),
      ]
      assert.deepStrictEqual(
        filtered2,
        [
          ['banana', 2],
          ['apricot', 3],
        ],
        'filtered by key and value'
      )

      // empty result
      const empty = [
        ...filterIterableKeys(entries, () => {
          return false
        }),
      ]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should filter based on key predicate only', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]
    const result = [
      ...filterIterableKeys(entries, (key) => {
        return key > 'b'
      }),
    ]
    expect(result).toEqual([
      ['c', 3],
      ['d', 4],
    ])
  })

  it('should filter based on value through second parameter', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]
    const result = [
      ...filterIterableKeys(entries, (_, value) => {
        return value % 2 === 0
      }),
    ]
    expect(result).toEqual([
      ['b', 2],
      ['d', 4],
    ])
  })

  it('should filter based on combined key-value predicate', () => {
    const entries: Array<[string, number]> = [
      ['a', 10],
      ['b', 20],
      ['c', 30],
    ]
    const result = [
      ...filterIterableKeys(entries, (key, value) => {
        return value > 15 && key !== 'c'
      }),
    ]
    expect(result).toEqual([['b', 20]])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...filterIterableKeys([], () => {
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
      ...filterIterableKeys(entries, (key) => {
        return key === 'z'
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
      ...filterIterableKeys(map, (key) => {
        return key >= 'y'
      }),
    ]
    expect(result).toEqual([
      ['y', 200],
      ['z', 300],
    ])
  })

  it('should work with numeric keys', () => {
    const entries: Array<[number, string]> = [
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
      [4, 'four'],
    ]
    const result = [
      ...filterIterableKeys(entries, (key) => {
        return key > 2
      }),
    ]
    expect(result).toEqual([
      [3, 'three'],
      [4, 'four'],
    ])
  })

  it('should work with complex key types', () => {
    const key1 = { id: 1 }
    const key2 = { id: 2 }
    const key3 = { id: 3 }
    const entries: Array<[{ id: number }, string]> = [
      [key1, 'one'],
      [key2, 'two'],
      [key3, 'three'],
    ]
    const result = [
      ...filterIterableKeys(entries, (key) => {
        return key.id % 2 === 1
      }),
    ]
    expect(result).toEqual([
      [key1, 'one'],
      [key3, 'three'],
    ])
  })
})
