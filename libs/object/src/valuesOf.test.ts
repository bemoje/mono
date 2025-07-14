import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { valuesOf } from './valuesOf'

describe(valuesOf.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, b: 2, c: 3 }
      const values = valuesOf(obj)

      // Should return array of object values
      assert(Array.isArray(values))
      assert.deepStrictEqual(values.sort(), [1, 2, 3])
    }).not.toThrow()
  })

  it('should return values of an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const values = valuesOf(obj)

    expect(values).toEqual(expect.arrayContaining([1, 2, 3]))
    expect(values).toHaveLength(3)
  })

  it('should handle empty object', () => {
    const obj = {}
    const values = valuesOf(obj)

    expect(values).toEqual([])
  })

  it('should handle object with different value types', () => {
    const obj = { a: 1, b: 'string', c: true, d: null, e: undefined }
    const values = valuesOf(obj)

    expect(values).toEqual(expect.arrayContaining([1, 'string', true, null, undefined]))
    expect(values).toHaveLength(5)
  })

  it('should only return enumerable own properties', () => {
    const obj = { a: 1, b: 2 }
    Object.defineProperty(obj, 'hidden', { value: 'secret', enumerable: false })

    const values = valuesOf(obj)

    expect(values).toEqual(expect.arrayContaining([1, 2]))
    expect(values).not.toContain('secret')
    expect(values).toHaveLength(2)
  })
})
