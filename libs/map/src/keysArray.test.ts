import { describe, expect, it } from 'vitest'
import { keysArray } from './keysArray'
import { ExtMap } from './ExtMap'

describe(keysArray.name, () => {
  it('should return an array of all keys', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    const result = keysArray(map)

    expect(result).toEqual(['a', 'b', 'c'])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should return an empty array for empty map', () => {
    const map = new ExtMap<string, number>()

    const result = keysArray(map)

    expect(result).toEqual([])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should work with native Map', () => {
    const map = new Map<string, number>([
      ['x', 10],
      ['y', 20],
    ])

    const result = keysArray(map)

    expect(result).toEqual(['x', 'y'])
  })

  it('should preserve key order', () => {
    const map = new ExtMap<string, number>([
      ['third', 3],
      ['first', 1],
      ['second', 2],
    ])

    const result = keysArray(map)

    expect(result).toEqual(['third', 'first', 'second'])
  })
})
