import { describe, expect, it } from 'vitest'
import { entriesArray } from './entriesArray'
import { ExtMap } from './ExtMap'

describe(entriesArray.name, () => {
  it('should return an array of all key-value pairs', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    const result = entriesArray(map)

    expect(result).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should return an empty array for empty map', () => {
    const map = new ExtMap<string, number>()

    const result = entriesArray(map)

    expect(result).toEqual([])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should work with native Map', () => {
    const map = new Map<string, number>([
      ['x', 10],
      ['y', 20],
    ])

    const result = entriesArray(map)

    expect(result).toEqual([
      ['x', 10],
      ['y', 20],
    ])
  })

  it('should preserve entry order', () => {
    const map = new ExtMap<string, number>([
      ['third', 3],
      ['first', 1],
      ['second', 2],
    ])

    const result = entriesArray(map)

    expect(result).toEqual([
      ['third', 3],
      ['first', 1],
      ['second', 2],
    ])
  })

  it('should handle complex value types', () => {
    const map = new ExtMap<string, { value: number }>([
      ['a', { value: 1 }],
      ['b', { value: 2 }],
    ])

    const result = entriesArray(map)

    expect(result).toEqual([
      ['a', { value: 1 }],
      ['b', { value: 2 }],
    ])
  })
})
