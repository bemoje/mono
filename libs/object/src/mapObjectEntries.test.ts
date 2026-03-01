import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapObjectEntries } from './mapObjectEntries'

describe(mapObjectEntries.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { name: 'John', age: 30, city: 'NYC' }

      // Transform keys to uppercase and values to strings
      const result = mapObjectEntries(obj, (key, value) => {
        return [key.toUpperCase(), String(value)]
      })

      assert.deepStrictEqual(result, { NAME: 'John', AGE: '30', CITY: 'NYC' })
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should transform both keys and values', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = mapObjectEntries(obj, (key, value) => {
        return [`new_${key}`, value * 2]
      })

      expect(result).toEqual({ new_a: 2, new_b: 4, new_c: 6 })
    })

    it('should handle string transformations', () => {
      const obj = { first: 'hello', second: 'world' }
      const result = mapObjectEntries(obj, (key, value) => {
        return [key.toUpperCase(), value.toUpperCase()]
      })

      expect(result).toEqual({ FIRST: 'HELLO', SECOND: 'WORLD' })
    })

    it('should preserve type relationships', () => {
      const obj = { x: 10, y: 20 }
      const result = mapObjectEntries(obj, (key, value) => {
        return [`coord_${key}`, value + 100]
      })

      expect(result).toEqual({ coord_x: 110, coord_y: 120 })
    })
  })

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const obj = {}
      const result = mapObjectEntries(obj, (key, value) => {
        return [key, value]
      })

      expect(result).toEqual({})
    })

    it('should handle mixed value types', () => {
      const obj = { str: 'text', num: 42, bool: true, arr: [1, 2], obj: { nested: true } }
      const result = mapObjectEntries(obj, (key, value) => {
        return [`type_${key}`, typeof value]
      })

      expect(result).toEqual({
        type_str: 'string',
        type_num: 'number',
        type_bool: 'boolean',
        type_arr: 'object',
        type_obj: 'object',
      })
    })
  })

  describe('complex transformations', () => {
    it('should handle key-value swapping', () => {
      const obj = { a: 'x', b: 'y', c: 'z' }
      const result = mapObjectEntries(obj, (key, value) => {
        return [value, key]
      })

      expect(result).toEqual({ x: 'a', y: 'b', z: 'c' })
    })

    it('should handle conditional transformations', () => {
      const obj = { small: 5, medium: 15, large: 25 }
      const result = mapObjectEntries(obj, (key, value) => {
        return [key, value > 10 ? 'big' : 'small']
      })

      expect(result).toEqual({ small: 'small', medium: 'big', large: 'big' })
    })
  })
})
