import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { filterObject } from './filterObject'
import { it } from 'vitest'

describe(filterObject.name, () => {
  it('examples', () => {
    expect(() => {
      // filter by value
      const obj = { a: 1, b: 2, c: 3 }
      const filtered = filterObject(obj, (value) => {
        return value > 1
      })
      assert.deepStrictEqual(filtered, { b: 2, c: 3 }, 'filtered by value')

      // filter by key
      const filtered2 = filterObject(obj, (value, key) => {
        return key !== 'b'
      })
      assert.deepStrictEqual(filtered2, { a: 1, c: 3 }, 'filtered by key')

      // empty result
      const empty = filterObject(obj, () => {
        return false
      })
      assert.deepStrictEqual(empty, {}, 'empty result')
    }).not.toThrow()
  })

  it('should filter based on value predicate', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = filterObject(obj, (value) => {
      return value % 2 === 0
    })
    expect(result).toEqual({ b: 2, d: 4 })
  })

  it('should filter based on key predicate', () => {
    const obj = { apple: 1, banana: 2, cherry: 3 }
    const result = filterObject(obj, (_, key) => {
      return key.toString().startsWith('a')
    })
    expect(result).toEqual({ apple: 1 })
  })

  it('should filter based on combined key-value predicate', () => {
    const obj = { a: 10, b: 20, c: 30 }
    const result = filterObject(obj, (value, key) => {
      return value > 15 && key !== 'c'
    })
    expect(result).toEqual({ b: 20 })
  })

  it('should handle empty object', () => {
    const result = filterObject({}, () => {
      return true
    })
    expect(result).toEqual({})
  })

  it('should return empty when no items match', () => {
    const obj = { a: 1, b: 2 }
    const result = filterObject(obj, (value) => {
      return value > 10
    })
    expect(result).toEqual({})
  })

  it('should return all properties when all match', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = filterObject(obj, () => {
      return true
    })
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should work with different value types', () => {
    const obj = { name: 'Alice', age: 30, active: true }
    const result = filterObject(obj, (value) => {
      return typeof value === 'number'
    })
    expect(result).toEqual({ age: 30 })
  })

  it('should work with complex value types', () => {
    const obj = { a: { count: 1 }, b: { count: 2 }, c: { count: 3 } }
    const result = filterObject(obj, (value) => {
      return value.count > 1
    })
    expect(result).toEqual({ b: { count: 2 }, c: { count: 3 } })
  })

  it('should not mutate the original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const originalCopy = { ...obj }
    filterObject(obj, (value) => {
      return value > 1
    })
    expect(obj).toEqual(originalCopy)
  })

  it('should work with nested objects', () => {
    const obj = {
      user1: { name: 'Alice', age: 25 },
      user2: { name: 'Bob', age: 30 },
      user3: { name: 'Charlie', age: 35 },
    }
    const result = filterObject(obj, (value) => {
      return value.age >= 30
    })
    expect(result).toEqual({ user2: { name: 'Bob', age: 30 }, user3: { name: 'Charlie', age: 35 } })
  })

  it('should preserve property ordering', () => {
    const obj = { z: 1, y: 2, x: 3 }
    const result = filterObject(obj, (value) => {
      return value > 1
    })
    expect(Object.keys(result)).toEqual(['y', 'x'])
  })
})
