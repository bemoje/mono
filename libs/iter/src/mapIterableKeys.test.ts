import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { mapIterableKeys } from './mapIterableKeys'

describe(mapIterableKeys.name, () => {
  it('examples', () => {
    expect(() => {
      // transform keys while preserving values
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const transformed = [...mapIterableKeys(entries, (key) => key.toUpperCase())]
      assert.deepStrictEqual(
        transformed,
        [
          ['A', 1],
          ['B', 2],
          ['C', 3],
        ],
        'keys transformed',
      )

      // use both key and value in transformation
      const indexed = [...mapIterableKeys(entries, (key, value) => `${key}_${value}`)]
      assert.deepStrictEqual(
        indexed,
        [
          ['a_1', 1],
          ['b_2', 2],
          ['c_3', 3],
        ],
        'keys with values',
      )

      // empty iterable
      const empty = [...mapIterableKeys([], (k: any, v: any) => k)]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should transform keys while preserving values', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
    ]
    const result = [...mapIterableKeys(entries, (key) => key.toUpperCase())]
    expect(result).toEqual([
      ['X', 10],
      ['Y', 20],
    ])
  })

  it('should use both key and value in transformation', () => {
    const entries: Array<[string, number]> = [
      ['item', 5],
      ['data', 10],
    ]
    const result = [...mapIterableKeys(entries, (key, value) => `${key}_${value}`)]
    expect(result).toEqual([
      ['item_5', 5],
      ['data_10', 10],
    ])
  })

  it('should handle type transformations', () => {
    const entries: Array<[number, string]> = [
      [1, 'one'],
      [2, 'two'],
    ]
    const result = [...mapIterableKeys(entries, (key) => `key_${key}`)]
    expect(result).toEqual([
      ['key_1', 'one'],
      ['key_2', 'two'],
    ])
  })

  it('should handle empty iterable', () => {
    const result = [...mapIterableKeys([], (key: any) => key)]
    expect(result).toEqual([])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      [10, 'ten'],
      [20, 'twenty'],
    ])
    const result = [...mapIterableKeys(map, (key) => key * 2)]
    expect(result).toEqual([
      [20, 'ten'],
      [40, 'twenty'],
    ])
  })

  it('should preserve original values exactly', () => {
    const objects = [{ id: 1 }, { id: 2 }]
    const entries: Array<[string, { id: number }]> = [
      ['a', objects[0]],
      ['b', objects[1]],
    ]
    const result = [...mapIterableKeys(entries, (key) => key + '_new')]

    expect(result[0][1]).toBe(objects[0]) // Same reference
    expect(result[1][1]).toBe(objects[1]) // Same reference
    expect(result).toEqual([
      ['a_new', { id: 1 }],
      ['b_new', { id: 2 }],
    ])
  })
})
