import { describe, expect, it } from 'vitest'
import { valuesArray } from './valuesArray'
import { ExtMap } from './ExtMap'

describe(valuesArray.name, () => {
  it('should return an array of all values', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    const result = valuesArray(map)

    expect(result).toEqual([1, 2, 3])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should return an empty array for empty map', () => {
    const map = new ExtMap<string, number>()

    const result = valuesArray(map)

    expect(result).toEqual([])
    expect(Array.isArray(result)).toBe(true)
  })

  it('should work with native Map', () => {
    const map = new Map<string, number>([
      ['x', 10],
      ['y', 20],
    ])

    const result = valuesArray(map)

    expect(result).toEqual([10, 20])
  })

  it('should preserve value order', () => {
    const map = new ExtMap<string, number>([
      ['third', 30],
      ['first', 10],
      ['second', 20],
    ])

    const result = valuesArray(map)

    expect(result).toEqual([30, 10, 20])
  })

  it('should handle duplicate values', () => {
    const map = new ExtMap<string, number>([
      ['a', 1],
      ['b', 1],
      ['c', 2],
    ])

    const result = valuesArray(map)

    expect(result).toEqual([1, 1, 2])
  })
})
