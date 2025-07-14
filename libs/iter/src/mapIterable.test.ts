import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { mapIterable } from './mapIterable'

describe(mapIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // transform both keys and values
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const transformed = [...mapIterable(entries, (value, key) => [key.toUpperCase(), value * 2])]
      assert.deepStrictEqual(
        transformed,
        [
          ['A', 2],
          ['B', 4],
          ['C', 6],
        ],
        'both transformed',
      )

      // swap key-value
      const swapped = [...mapIterable(entries, (value, key) => [value.toString(), key])]
      assert.deepStrictEqual(
        swapped,
        [
          ['1', 'a'],
          ['2', 'b'],
          ['3', 'c'],
        ],
        'swapped',
      )

      // empty iterable
      const empty = [...mapIterable([], (v: any, k: any) => [k, v])]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should transform both keys and values', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
    ]
    const result = [...mapIterable(entries, (value, key) => [key + '_suffix', value + 1])]
    expect(result).toEqual([
      ['x_suffix', 11],
      ['y_suffix', 21],
    ])
  })

  it('should handle type transformations', () => {
    const entries: Array<[number, string]> = [
      [1, 'one'],
      [2, 'two'],
    ]
    const result = [...mapIterable(entries, (value, key) => [key.toString(), value.length])]
    expect(result).toEqual([
      ['1', 3],
      ['2', 3],
    ])
  })

  it('should swap keys and values', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
    ]
    const result = [...mapIterable(entries, (value, key) => [value, key])]
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ])
  })

  it('should handle empty iterable', () => {
    const result = [...mapIterable([], (value: any, key: any) => [key, value])]
    expect(result).toEqual([])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['key1', 100],
      ['key2', 200],
    ])
    const result = [...mapIterable(map, (value, key) => [key.toUpperCase(), value / 10])]
    expect(result).toEqual([
      ['KEY1', 10],
      ['KEY2', 20],
    ])
  })

  it('should handle complex transformations', () => {
    const entries: Array<[string, { count: number }]> = [
      ['item1', { count: 5 }],
      ['item2', { count: 10 }],
    ]
    const result = [...mapIterable(entries, (value, key) => [`${key}_processed`, value.count * 2])]
    expect(result).toEqual([
      ['item1_processed', 10],
      ['item2_processed', 20],
    ])
  })
})
