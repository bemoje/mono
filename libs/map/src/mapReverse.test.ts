import { describe, expect, it } from 'vitest'
import { mapReverse } from './mapReverse'

describe(mapReverse.name, () => {
  it('should return a new Map with the entries of the original Map in reverse order', () => {
    const map = new Map([
      ['first', '1'],
      ['second', '2'],
      ['third', '3'],
    ])
    const reversedMap = mapReverse(map)
    expect([...reversedMap.entries()]).toEqual([
      ['third', '3'],
      ['second', '2'],
      ['first', '1'],
    ])
  })

  it('should not modify the original Map', () => {
    const map = new Map([
      ['first', '1'],
      ['second', '2'],
      ['third', '3'],
    ])
    mapReverse(map)
    expect([...map.entries()].flat(2).join(',')).toBe(
      [
        ['third', '3'],
        ['second', '2'],
        ['first', '1'],
      ]
        .flat(2)
        .join(','),
    )
  })

  it('should return an empty Map when the input Map is empty', () => {
    const map = new Map()
    const reversedMap = mapReverse(map)
    expect(reversedMap.size).toBe(0)
  })

  it('should handle Maps with non-string keys', () => {
    const map = new Map([
      [1, '1'],
      [2, '2'],
      [3, '3'],
    ])
    const reversedMap = mapReverse(map)
    expect([...reversedMap.entries()]).toEqual([
      [3, '3'],
      [2, '2'],
      [1, '1'],
    ])
  })
})
