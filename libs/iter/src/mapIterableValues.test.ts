import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { mapIterableValues } from './mapIterableValues'

describe(mapIterableValues.name, () => {
  it('examples', () => {
    expect(() => {
      // transform values while preserving keys
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const transformed = [...mapIterableValues(entries, (value) => value * 2)]
      assert.deepStrictEqual(
        transformed,
        [
          ['a', 2],
          ['b', 4],
          ['c', 6],
        ],
        'values transformed',
      )

      // use both key and value in transformation
      const indexed = [...mapIterableValues(entries, (value, key) => `${key}:${value}`)]
      assert.deepStrictEqual(
        indexed,
        [
          ['a', 'a:1'],
          ['b', 'b:2'],
          ['c', 'c:3'],
        ],
        'values with keys',
      )

      // empty iterable
      const empty = [...mapIterableValues([], (v: any, k: any) => v)]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should transform values while preserving keys', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
    ]
    const result = [...mapIterableValues(entries, (value) => value / 2)]
    expect(result).toEqual([
      ['x', 5],
      ['y', 10],
    ])
  })

  it('should use both key and value in transformation', () => {
    const entries: Array<[string, number]> = [
      ['item', 5],
      ['data', 10],
    ]
    const result = [...mapIterableValues(entries, (value, key) => `${key}_${value}`)]
    expect(result).toEqual([
      ['item', 'item_5'],
      ['data', 'data_10'],
    ])
  })

  it('should handle type transformations', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
    ]
    const result = [...mapIterableValues(entries, (value) => value.toString())]
    expect(result).toEqual([
      ['a', '1'],
      ['b', '2'],
    ])
  })

  it('should handle empty iterable', () => {
    const result = [...mapIterableValues([], (value: any) => value)]
    expect(result).toEqual([])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['key1', 100],
      ['key2', 200],
    ])
    const result = [...mapIterableValues(map, (value) => value * 0.01)]
    expect(result).toEqual([
      ['key1', 1],
      ['key2', 2],
    ])
  })

  it('should preserve original keys exactly', () => {
    const keyObjects = [{ name: 'key1' }, { name: 'key2' }]
    const entries: Array<[{ name: string }, number]> = [
      [keyObjects[0], 10],
      [keyObjects[1], 20],
    ]
    const result = [...mapIterableValues(entries, (value) => value + 1)]

    expect(result[0][0]).toBe(keyObjects[0]) // Same reference
    expect(result[1][0]).toBe(keyObjects[1]) // Same reference
    expect(result).toEqual([
      [{ name: 'key1' }, 11],
      [{ name: 'key2' }, 21],
    ])
  })

  it('should handle complex value transformations', () => {
    const entries: Array<[string, { count: number; name: string }]> = [
      ['item1', { count: 5, name: 'first' }],
      ['item2', { count: 10, name: 'second' }],
    ]
    const result = [
      ...mapIterableValues(entries, (value, key) => ({
        ...value,
        count: value.count * 2,
        key,
      })),
    ]
    expect(result).toEqual([
      ['item1', { count: 10, name: 'first', key: 'item1' }],
      ['item2', { count: 20, name: 'second', key: 'item2' }],
    ])
  })
})
