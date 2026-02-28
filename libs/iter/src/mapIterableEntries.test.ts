import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapIterableEntries } from './mapIterableEntries'

describe(mapIterableEntries.name, () => {
  it('examples', () => {
    expect(() => {
      // transform both keys and values
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const transformed = [
        ...mapIterableEntries(entries, (value, key) => {
          return [key.toUpperCase(), value * 2]
        }),
      ]
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
      const swapped = [
        ...mapIterableEntries(entries, (value, key) => {
          return [value.toString(), key]
        }),
      ]
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
      const empty = [
        ...mapIterableEntries([], (v: any, k: any) => {
          return [k, v]
        }),
      ]
      assert.deepStrictEqual(empty, [], 'empty result')
    }).not.toThrow()
  })

  it('should transform both keys and values', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
    ]
    const result = [
      ...mapIterableEntries(entries, (value, key) => {
        return [`${key}_suffix`, value + 1]
      }),
    ]
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
    const result = [
      ...mapIterableEntries(entries, (value, key) => {
        return [key.toString(), value.length]
      }),
    ]
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
    const result = [
      ...mapIterableEntries(entries, (value, key) => {
        return [value, key]
      }),
    ]
    expect(result).toEqual([
      [1, 'a'],
      [2, 'b'],
    ])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...mapIterableEntries([], (value: any, key: any) => {
        return [key, value]
      }),
    ]
    expect(result).toEqual([])
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['key1', 100],
      ['key2', 200],
    ])
    const result = [
      ...mapIterableEntries(map, (value, key) => {
        return [key.toUpperCase(), value / 10]
      }),
    ]
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
    const result = [
      ...mapIterableEntries(entries, (value, key) => {
        return [`${key}_processed`, value.count * 2]
      }),
    ]
    expect(result).toEqual([
      ['item1_processed', 10],
      ['item2_processed', 20],
    ])
  })
})
