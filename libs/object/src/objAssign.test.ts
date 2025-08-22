import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { objAssign } from './objAssign'

describe(objAssign.name, () => {
  it('examples', () => {
    expect(() => {
      const target = { a: 1, b: 2 }
      const source = { b: 3, c: 4 }
      const result = objAssign(target, source)

      // Should merge objects like Object.assign but return the result
      assert.deepStrictEqual(result, { a: 1, b: 3, c: 4 })
      assert.strictEqual(result, target) // Should be the same reference
    }).not.toThrow()
  })

  it('should merge objects like Object.assign', () => {
    const target = { a: 1, b: 2 }
    const source = { b: 3, c: 4 }
    const result = objAssign(target, source)

    expect(result).toEqual({ a: 1, b: 3, c: 4 })
    expect(result).toBe(target) // Should mutate the target
  })

  it('should handle multiple sources', () => {
    const target = { a: 1 }
    const source1 = { b: 2 }
    const source2 = { c: 3 }
    const result = objAssign(target, source1, source2)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty target', () => {
    const target = {}
    const source = { a: 1, b: 2 }
    const result = objAssign(target, source)

    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle empty sources', () => {
    const target = { a: 1 }
    const result = objAssign(target, {})

    expect(result).toEqual({ a: 1 })
  })

  it('should override properties', () => {
    const target = { a: 1, b: 2 }
    const source = { a: 10, c: 3 }
    const result = objAssign(target, source)

    expect(result).toEqual({ a: 10, b: 2, c: 3 })
  })
})
