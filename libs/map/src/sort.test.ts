import { describe, expect, it } from 'vitest'
import { sort } from './sort'
import { ExtMap } from './ExtMap'
import { entriesArray } from './entriesArray'

describe(sort.name, () => {
  it('should sort entries using compare function', () => {
    const map = new ExtMap<string, number>([
      ['c', 3],
      ['a', 1],
      ['b', 2],
    ])

    const result = sort(map, ([k1], [k2]) => (k1 as string).localeCompare(k2 as string))

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

    sort(map, ([k1], [k2]) => (k1 as string).localeCompare(k2 as string))

    expect(entriesArray(map)).toEqual([
      ['a', 1],
      ['m', 13],
      ['z', 26],
    ])
  })

  it('should handle empty map', () => {
    const map = new ExtMap<string, number>()

    const result = sort(map, ([k1], [k2]) => (k1 as string).localeCompare(k2 as string))

    expect(result).toBe(map)
    expect(entriesArray(map)).toEqual([])
  })

  it('should sort by values', () => {
    const map = new ExtMap<string, number>([
      ['a', 30],
      ['b', 10],
      ['c', 20],
    ])

    sort(map, ([, v1], [, v2]) => (v1 as number) - (v2 as number))

    expect(entriesArray(map)).toEqual([
      ['b', 10],
      ['c', 20],
      ['a', 30],
    ])
  })

  it('should handle complex comparison', () => {
    const map = new ExtMap<string, { name: string; age: number }>([
      ['person1', { name: 'Alice', age: 30 }],
      ['person2', { name: 'Bob', age: 25 }],
      ['person3', { name: 'Charlie', age: 35 }],
    ])

    sort(map, ([, v1], [, v2]) => (v1 as { age: number }).age - (v2 as { age: number }).age)

    expect(entriesArray(map)).toEqual([
      ['person2', { name: 'Bob', age: 25 }],
      ['person1', { name: 'Alice', age: 30 }],
      ['person3', { name: 'Charlie', age: 35 }],
    ])
  })

  it('should handle single entry', () => {
    const map = new ExtMap<string, number>([['a', 1]])

    sort(map, ([k1], [k2]) => (k1 as string).localeCompare(k2 as string))

    expect(entriesArray(map)).toEqual([['a', 1]])
  })
})
