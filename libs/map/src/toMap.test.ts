import { describe, expect, it } from 'vitest'
import { toMap } from './toMap'
import { ExtMap } from './ExtMap'

describe(toMap.name, () => {
  it('should convert ExtMap to native Map', () => {
    const extMap = new ExtMap<string, number>([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    const result = toMap(extMap)

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(3)
    expect(result.get('a')).toBe(1)
    expect(result.get('b')).toBe(2)
    expect(result.get('c')).toBe(3)
  })

  it('should create empty Map from empty ExtMap', () => {
    const extMap = new ExtMap<string, number>()

    const result = toMap(extMap)

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
  })

  it('should preserve entry order', () => {
    const extMap = new ExtMap<string, number>([
      ['third', 3],
      ['first', 1],
      ['second', 2],
    ])

    const result = toMap(extMap)
    const entries = Array.from(result.entries())

    expect(entries).toEqual([
      ['third', 3],
      ['first', 1],
      ['second', 2],
    ])
  })

  it('should work with native Map as input', () => {
    const nativeMap = new Map<string, number>([
      ['x', 10],
      ['y', 20],
    ])

    const result = toMap(nativeMap)

    expect(result).toBeInstanceOf(Map)
    expect(result).not.toBe(nativeMap) // Should be a new instance
    expect(result.size).toBe(2)
    expect(result.get('x')).toBe(10)
    expect(result.get('y')).toBe(20)
  })

  it('should handle complex value types', () => {
    const extMap = new ExtMap<string, { value: number }>([
      ['a', { value: 1 }],
      ['b', { value: 2 }],
    ])

    const result = toMap(extMap)

    expect(result).toBeInstanceOf(Map)
    expect(result.get('a')).toEqual({ value: 1 })
    expect(result.get('b')).toEqual({ value: 2 })
  })
})
