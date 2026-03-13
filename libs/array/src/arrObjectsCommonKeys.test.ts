import { arrObjectsCommonKeys } from './arrObjectsCommonKeys'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(arrObjectsCommonKeys.name, () => {
  it('should return keys common to all objects', () => {
    const result = arrObjectsCommonKeys([
      { a: 1, b: 2, d: 4 },
      { a: 1, b: 2, c: 3 },
    ])
    expect(result).toEqual(['a', 'b'])
  })

  it('should return all keys when all objects have the same keys', () => {
    const result = arrObjectsCommonKeys([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ])
    expect(result).toEqual(['x', 'y'])
  })

  it('should return an empty array when objects share no keys', () => {
    const result = arrObjectsCommonKeys([{ a: 1 }, { b: 2 }, { c: 3 }])
    expect(result).toEqual([])
  })

  it('should return all keys for a single object', () => {
    const result = arrObjectsCommonKeys([{ a: 1, b: 2, c: 3 }])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should return an empty array when any object is empty', () => {
    const result = arrObjectsCommonKeys([{ a: 1, b: 2 }, {}])
    expect(result).toEqual([])
  })

  it('should handle objects with many keys where only some overlap', () => {
    const result = arrObjectsCommonKeys([
      { a: 1, b: 2, c: 3, d: 4 },
      { b: 5, c: 6, d: 7, e: 8 },
      { c: 9, d: 10, e: 11, f: 12 },
    ])
    expect(result).toEqual(['c', 'd'])
  })

  it('should handle objects with various value types', () => {
    const result = arrObjectsCommonKeys([
      { name: 'Alice', age: 30, active: true },
      { name: 'Bob', age: 25, score: 100 },
    ])
    expect(result).toEqual(['name', 'age'])
  })
})
