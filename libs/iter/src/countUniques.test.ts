import { countUniques } from './countUniques'
import { describe } from "vitest";
import { it } from "vitest";
import { expect } from "vitest";

// Helper to convert ExtMap to plain object for easier assertions
function extMapToObject<K, V>(map: any): Record<string, V> {
  const obj: Record<string, V> = {}
  for (const [k, v] of map) {
    obj[String(k)] = v
  }
  return obj
}

describe('countUniques', () => {
  it('counts unique values in an array', () => {
    const input = ['a', 'b', 'a', 'c', 'b', 'a']
    const result = countUniques(input)
    expect(extMapToObject(result)).toEqual({ a: 3, b: 2, c: 1 })
  })

  it('returns empty map for empty input', () => {
    const input: string[] = []
    const result = countUniques(input)
    expect([...result.entries()]).toEqual([])
  })

  it('works with numbers', () => {
    const input = [1, 2, 2, 3, 1, 1]
    const result = countUniques(input)
    expect(extMapToObject(result)).toEqual({ 1: 3, 2: 2, 3: 1 })
  })

  it('works with iterables (Set)', () => {
    const input = new Set(['x', 'y', 'x', 'z'])
    const result = countUniques(input)
    expect(extMapToObject(result)).toEqual({ x: 1, y: 1, z: 1 })
  })

  it('sorts by count descending', () => {
    const input = ['a', 'b', 'b', 'c', 'c', 'c']
    const result = countUniques(input)
    const entries = [...result.entries()]
    expect(entries[0][0]).toBe('c')
    expect(entries[1][0]).toBe('b')
    expect(entries[2][0]).toBe('a')
  })

  it('handles non-primitive values', () => {
    const obj1 = { id: 1 }
    const obj2 = { id: 2 }
    const input = [obj1, obj2, obj1]
    const result = countUniques(input)
    expect(result.get(obj1)).toBe(2)
    expect(result.get(obj2)).toBe(1)
  })
})
