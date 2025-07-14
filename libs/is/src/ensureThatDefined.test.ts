import { ensureThatDefined } from './ensureThatDefined'
import { describe, expect, it } from 'vitest'
import assert from 'node:assert'

describe(ensureThatDefined.name, () => {
  it('examples', () => {
    expect(() => {
      // Should return undefined when input is undefined
      const result1 = ensureThatDefined(undefined, (x: unknown): x is string => typeof x === 'string')
      assert.strictEqual(result1, undefined)

      // Should validate when input is defined
      const result2 = ensureThatDefined('hello', (x: unknown): x is string => typeof x === 'string')
      assert.strictEqual(result2, 'hello')
    }).not.toThrow()
  })

  describe('when value is undefined', () => {
    it('should return undefined without validation', () => {
      const validator = (x: unknown): x is string => typeof x === 'string'
      const result = ensureThatDefined(undefined, validator)
      expect(result).toBe(undefined)
    })
  })

  describe('when value is defined and valid', () => {
    it('should return the value', () => {
      const validator = (x: unknown): x is string => typeof x === 'string'
      const result = ensureThatDefined('hello', validator)
      expect(result).toBe('hello')
    })

    it('should work with different validators', () => {
      const numberValidator = (x: unknown): x is number => typeof x === 'number'
      expect(ensureThatDefined(123, numberValidator)).toBe(123)

      const arrayValidator = (x: unknown): x is Array<any> => Array.isArray(x)
      expect(ensureThatDefined([1, 2, 3], arrayValidator)).toEqual([1, 2, 3])
    })
  })

  describe('when value is defined but invalid', () => {
    it('should throw an error', () => {
      const validator = (x: unknown): x is string => typeof x === 'string'
      expect(() => ensureThatDefined(123, validator)).toThrow()
      expect(() => ensureThatDefined(null, validator)).toThrow()
      expect(() => ensureThatDefined([], validator)).toThrow()
    })

    it('should use custom error constructor when provided', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'CustomError'
        }
      }

      const validator = (x: unknown): x is string => typeof x === 'string'
      expect(() => {
        const result = ensureThatDefined(123, validator, { Err: CustomError })
        // If it's a promise, we need to handle it differently, but for simple validators it should throw synchronously
        return result
      }).toThrow(CustomError)
    })
  })

  describe('with different value types', () => {
    it('should handle null values (not undefined)', () => {
      const validator = (x: unknown): x is string => typeof x === 'string'
      expect(() => ensureThatDefined(null, validator)).toThrow()
    })

    it('should handle zero and false values', () => {
      const numberValidator = (x: unknown): x is number => typeof x === 'number'
      expect(ensureThatDefined(0, numberValidator)).toBe(0)

      const booleanValidator = (x: unknown): x is boolean => typeof x === 'boolean'
      expect(ensureThatDefined(false, booleanValidator)).toBe(false)
    })
  })
})
