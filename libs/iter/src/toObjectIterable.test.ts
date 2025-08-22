import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { toObjectIterable } from './toObjectIterable'

describe(toObjectIterable.name, () => {
  it('examples', () => {
    expect(() => {
      // convert key-value pairs to object
      const entries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]
      const obj = toObjectIterable(entries)
      assert.deepStrictEqual(obj, { a: 1, b: 2, c: 3 }, 'object created')

      // with different value types
      const mixed: Array<[string, string | number]> = [
        ['name', 'John'],
        ['age', 30],
      ]
      const person = toObjectIterable(mixed)
      assert.deepStrictEqual(person, { name: 'John', age: 30 }, 'mixed types')

      // empty iterable
      const empty = toObjectIterable([])
      assert.deepStrictEqual(empty, {}, 'empty object')
    }).not.toThrow()
  })

  it('should convert simple key-value pairs', () => {
    const entries: Array<[string, number]> = [
      ['x', 10],
      ['y', 20],
      ['z', 30],
    ]
    const result = toObjectIterable(entries)
    expect(result).toEqual({ x: 10, y: 20, z: 30 })
    expect(typeof result).toBe('object')
  })

  it('should handle different value types', () => {
    const entries: Array<[string, string | number | boolean]> = [
      ['name', 'Alice'],
      ['age', 25],
      ['active', true],
    ]
    const result = toObjectIterable(entries)
    expect(result).toEqual({ name: 'Alice', age: 25, active: true })
  })

  it('should handle empty iterable', () => {
    const result = toObjectIterable([])
    expect(result).toEqual({})
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    const result = toObjectIterable(map)
    expect(result).toEqual({ key1: 'value1', key2: 'value2' })
  })

  it('should handle object values', () => {
    const entries: Array<[string, { id: number; name: string }]> = [
      ['user1', { id: 1, name: 'John' }],
      ['user2', { id: 2, name: 'Jane' }],
    ]
    const result = toObjectIterable(entries)
    expect(result).toEqual({
      user1: { id: 1, name: 'John' },
      user2: { id: 2, name: 'Jane' },
    })
  })

  it('should preserve value references', () => {
    const obj1 = { data: 'test1' }
    const obj2 = { data: 'test2' }
    const entries: Array<[string, { data: string }]> = [
      ['a', obj1],
      ['b', obj2],
    ]
    const result = toObjectIterable(entries)

    expect(result.a).toBe(obj1) // Same reference
    expect(result.b).toBe(obj2) // Same reference
  })

  it('should handle duplicate keys (last wins)', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['a', 3],
    ]
    const result = toObjectIterable(entries)
    expect(result).toEqual({ a: 3, b: 2 }) // Last 'a' value wins
  })

  it('should maintain proper typing', () => {
    const entries: Array<['name' | 'age', string | number]> = [
      ['name', 'Bob'],
      ['age', 42],
    ]
    const result = toObjectIterable(entries)

    // TypeScript should infer: Record<'name' | 'age', string | number>
    expect(result.name).toBe('Bob')
    expect(result.age).toBe(42)
  })
})
