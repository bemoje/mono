import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { mapObjectKeys } from './mapObjectKeys'

describe(mapObjectKeys.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { firstName: 'John', lastName: 'Doe', age: 30 }

      // Transform keys to uppercase
      const result = mapObjectKeys(obj, (key) => key.toUpperCase())

      assert.deepStrictEqual(result, {
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
        AGE: 30,
      })
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should transform keys while preserving values', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = mapObjectKeys(obj, (key) => `prefix_${key}`)

      expect(result).toEqual({
        prefix_a: 1,
        prefix_b: 2,
        prefix_c: 3,
      })
    })

    it('should allow access to values during key transformation', () => {
      const obj = { small: 5, medium: 15, large: 25 }
      const result = mapObjectKeys(obj, (key, value) => `${key}_${value > 10 ? 'big' : 'small'}`)

      expect(result).toEqual({
        small_small: 5,
        medium_big: 15,
        large_big: 25,
      })
    })

    it('should handle string keys', () => {
      const obj = { hello: 'world', foo: 'bar' }
      const result = mapObjectKeys(obj, (key) => key.split('').reverse().join(''))

      expect(result).toEqual({
        olleh: 'world',
        oof: 'bar',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const obj = {}
      const result = mapObjectKeys(obj, (key) => key)

      expect(result).toEqual({})
    })

    it('should handle objects with mixed value types', () => {
      const obj = { str: 'text', num: 42, bool: true, arr: [1, 2] }
      const result = mapObjectKeys(obj, (key, value) => `${key}_${typeof value}`)

      expect(result).toEqual({
        str_string: 'text',
        num_number: 42,
        bool_boolean: true,
        arr_object: [1, 2],
      })
    })
  })

  describe('transformations', () => {
    it('should handle camelCase to snake_case conversion', () => {
      const obj = { firstName: 'John', lastName: 'Doe', phoneNumber: '123-456-7890' }
      const result = mapObjectKeys(obj, (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase())

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '123-456-7890',
      })
    })

    it('should handle value-dependent key transformations', () => {
      const obj = { a: 1, b: 10, c: 100 }
      const result = mapObjectKeys(obj, (key, value) => {
        if (value < 10) return `small_${key}`
        if (value < 100) return `medium_${key}`
        return `large_${key}`
      })

      expect(result).toEqual({
        small_a: 1,
        medium_b: 10,
        large_c: 100,
      })
    })

    it('should preserve complex value types', () => {
      const complexObj = {
        data: { nested: { deep: 'value' } },
        func: () => 'test',
        date: new Date('2023-01-01'),
      }

      const result = mapObjectKeys(complexObj, (key) => `wrapped_${key}`)

      expect(result.wrapped_data).toEqual({ nested: { deep: 'value' } })
      expect(typeof result.wrapped_func).toBe('function')
      expect((result.wrapped_func as () => string)()).toBe('test')
      expect(result.wrapped_date).toBeInstanceOf(Date)
    })
  })
})
