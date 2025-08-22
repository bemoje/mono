import { describe, expect, it } from 'vitest'
import { sortByValues } from './sortByValues'
import { ExtMap } from './ExtMap'
import { entriesArray } from './entriesArray'

describe(sortByValues.name, () => {
  it('should sort entries by values', () => {
    const map = new ExtMap<string, number>([
      ['c', 3],
      ['a', 1],
      ['b', 2],
    ])

    const result = sortByValues(map, (a, b) => (a as number) - (b as number))

    expect(result).toBe(map) // Should return the same instance
    expect(entriesArray(map)).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
  })

  it('should work with native Map', () => {
    const map = new Map<string, number>([
      ['z', 26],
      ['a', 1],
      ['m', 13],
    ])

    sortByValues(map, (a, b) => (a as number) - (b as number))

    expect(entriesArray(map)).toEqual([
      ['a', 1],
      ['m', 13],
      ['z', 26],
    ])
  })

  it('should handle empty map', () => {
    const map = new ExtMap<string, number>()

    const result = sortByValues(map, (a, b) => (a as number) - (b as number))

    expect(result).toBe(map)
    expect(entriesArray(map)).toEqual([])
  })

  it('should sort string values', () => {
    const map = new ExtMap<number, string>([
      [3, 'charlie'],
      [1, 'alice'],
      [2, 'bob'],
    ])

    sortByValues(map, (a, b) => (a as string).localeCompare(b as string))

    expect(entriesArray(map)).toEqual([
      [1, 'alice'],
      [2, 'bob'],
      [3, 'charlie'],
    ])
  })

  it('should sort in reverse order', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    sortByValues(map, (a, b) => (b as number) - (a as number))

    expect(entriesArray(map)).toEqual([
      ['c', 3],
      ['b', 2],
      ['a', 1],
    ])
  })

  it('should handle single entry', () => {
    const map = new ExtMap<string, number>([['a', 1]])

    sortByValues(map, (a, b) => (a as number) - (b as number))

    expect(entriesArray(map)).toEqual([['a', 1]])
  })

  it('should handle complex value types', () => {
    const map = new ExtMap<string, { score: number; name: string }>([
      ['player1', { score: 300, name: 'Alice' }],
      ['player2', { score: 100, name: 'Bob' }],
      ['player3', { score: 200, name: 'Charlie' }],
    ])

    sortByValues(map, (a, b) => (a as { score: number }).score - (b as { score: number }).score)

    expect(entriesArray(map)).toEqual([
      ['player2', { score: 100, name: 'Bob' }],
      ['player3', { score: 200, name: 'Charlie' }],
      ['player1', { score: 300, name: 'Alice' }],
    ])
  })

  it('should handle duplicate values', () => {
    const map = new ExtMap<string, number>([
      ['a', 2],
      ['b', 1],
      ['c', 2],
      ['d', 1],
    ])

    sortByValues(map, (a, b) => (a as number) - (b as number))

    const result = entriesArray(map)
    expect(result).toHaveLength(4)

    // Check that all values are sorted (allow for stable sort of duplicate values)
    const values = result.map(([, v]) => v)
    expect(values).toEqual([1, 1, 2, 2])
  })
})
