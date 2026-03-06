import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapIterableEntries } from './mapIterableEntries'

describe(mapIterableEntries.name, () => {
  it('examples', () => {
    expect(() => {
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const mapped = [
        ...mapIterableEntries(entries, ([key, value]) => {
          return [key.toUpperCase(), value * 2] as [string, number]
        }),
      ]
      assert.deepStrictEqual(
        mapped,
        [
          ['A', 2],
          ['B', 4],
          ['C', 6],
        ],
        'transformed entries'
      )
    }).not.toThrow()
  })

  it('should transform each entry', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]
    const result = [
      ...mapIterableEntries(entries, ([key, value]) => {
        return [key.toUpperCase(), value * 2] as [string, number]
      }),
    ]
    expect(result).toEqual([
      ['A', 2],
      ['B', 4],
      ['C', 6],
    ])
  })

  it('should handle empty iterable', () => {
    const result = [
      ...mapIterableEntries([], (entry: [string, number]) => {
        return entry
      }),
    ]
    expect(result).toEqual([])
  })

  it('should support type transformation', () => {
    const entries: Array<[number, string]> = [
      [1, 'a'],
      [2, 'b'],
    ]
    const result = [
      ...mapIterableEntries(entries, ([key, value]) => {
        return [String(key), value.toUpperCase()] as [string, string]
      }),
    ]
    expect(result).toEqual([
      ['1', 'A'],
      ['2', 'B'],
    ])
  })
})
