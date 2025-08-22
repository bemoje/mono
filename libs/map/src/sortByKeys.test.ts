import { describe, expect, it } from 'vitest'
import { sortByKeys } from './sortByKeys'
import { ExtMap } from './ExtMap'
import { entriesArray } from './entriesArray'

describe(sortByKeys.name, () => {
  it('should sort entries by keys', () => {
    const map = new ExtMap<string, number>([
      ['c', 3],
      ['a', 1],
      ['b', 2],
    ])

    const result = sortByKeys(map, (a, b) => (a as string).localeCompare(b as string))

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

    sortByKeys(map, (a, b) => (a as string).localeCompare(b as string))

    expect(entriesArray(map)).toEqual([
      ['a', 1],
      ['m', 13],
      ['z', 26],
    ])
  })

  it('should handle empty map', () => {
    const map = new ExtMap<string, number>()

    const result = sortByKeys(map, (a, b) => (a as string).localeCompare(b as string))

    expect(result).toBe(map)
    expect(entriesArray(map)).toEqual([])
  })

  it('should sort numeric keys', () => {
    const map = new ExtMap<number, string>([
      [3, 'three'],
      [1, 'one'],
      [2, 'two'],
    ])

    sortByKeys(map, (a, b) => (a as number) - (b as number))

    expect(entriesArray(map)).toEqual([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ])
  })

  it('should sort in reverse order', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    sortByKeys(map, (a, b) => (b as string).localeCompare(a as string))

    expect(entriesArray(map)).toEqual([
      ['c', 3],
      ['b', 2],
      ['a', 1],
    ])
  })

  it('should handle single entry', () => {
    const map = new ExtMap<string, number>([['a', 1]])

    sortByKeys(map, (a, b) => (a as string).localeCompare(b as string))

    expect(entriesArray(map)).toEqual([['a', 1]])
  })

  it('should handle complex key types', () => {
    const map = new ExtMap<{ id: number; name: string }, boolean>([
      [{ id: 3, name: 'Charlie' }, true],
      [{ id: 1, name: 'Alice' }, false],
      [{ id: 2, name: 'Bob' }, true],
    ])

    sortByKeys(map, (a, b) => (a as { id: number }).id - (b as { id: number }).id)

    expect(entriesArray(map)).toEqual([
      [{ id: 1, name: 'Alice' }, false],
      [{ id: 2, name: 'Bob' }, true],
      [{ id: 3, name: 'Charlie' }, true],
    ])
  })
})
