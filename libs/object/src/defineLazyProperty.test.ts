import assert from 'assert'
import { defineLazyProperty } from './defineLazyProperty'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(defineLazyProperty.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = {}

      // Basic lazy property
      let callCount = 0
      defineLazyProperty(obj, 'computed', () => {
        callCount++
        return 'expensive-computation'
      })

      // First access computes the value
      assert.strictEqual(obj.computed, 'expensive-computation')
      assert.strictEqual(callCount, 1)

      // Second access returns cached value
      assert.strictEqual(obj.computed, 'expensive-computation')
      assert.strictEqual(callCount, 1) // Still 1, not called again

      // Lazy property with descriptor options
      const cache: any = {}
      defineLazyProperty(
        cache,
        'data',
        () => {
          return { fetched: 'from-api' }
        },
        {
          enumerable: true,
        },
      )
      assert.deepStrictEqual(cache.data, { fetched: 'from-api' })
      assert.strictEqual(Object.propertyIsEnumerable.call(cache, 'data'), true)
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define a lazy property that evaluates on first access', () => {
      const obj: any = {}
      let executed = false

      defineLazyProperty(obj, 'lazy', () => {
        executed = true
        return 'computed-value'
      })

      expect(executed).toBe(false) // Not executed yet
      expect(obj.lazy).toBe('computed-value')
      expect(executed).toBe(true) // Now executed
    })

    it('should cache the result after first evaluation', () => {
      const obj: any = {}
      let callCount = 0

      defineLazyProperty(obj, 'cached', () => {
        callCount++
        return `call-${callCount}`
      })

      expect(obj.cached).toBe('call-1')
      expect(obj.cached).toBe('call-1') // Same value, not re-computed
      expect(callCount).toBe(1)
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineLazyProperty(obj, 'prop', () => {
        return 'value'
      })

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('lazy')
      let computed = false

      defineLazyProperty(obj, sym, () => {
        computed = true
        return 'symbol-value'
      })

      expect(computed).toBe(false)
      expect(obj[sym]).toBe('symbol-value')
      expect(computed).toBe(true)
    })
  })

  describe('caching behavior', () => {
    it('should replace getter with value after first access', () => {
      const obj: any = {}

      defineLazyProperty(obj, 'prop', () => {
        return 42
      })

      // Initially should have a getter
      let descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor?.get).toBeDefined()
      expect(descriptor?.value).toBeUndefined()

      // Access the property
      expect(obj.prop).toBe(42)

      // Should now have a value, not a getter
      descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor?.value).toBe(42)
      expect(descriptor?.get).toBeUndefined()
    })

    it('should handle different value types', () => {
      const obj: any = {}

      // String value
      defineLazyProperty(obj, 'str', () => {
        return 'string-value'
      })
      expect(obj.str).toBe('string-value')

      // Object value
      const objValue = { nested: true }
      defineLazyProperty(obj, 'obj', () => {
        return objValue
      })
      expect(obj.obj).toBe(objValue)

      // Function value
      const fnValue = () => {
        return 'function-result'
      }
      defineLazyProperty(obj, 'fn', () => {
        return fnValue
      })
      expect(obj.fn).toBe(fnValue)

      // Array value
      const arrValue = [1, 2, 3]
      defineLazyProperty(obj, 'arr', () => {
        return arrValue
      })
      expect(obj.arr).toBe(arrValue)
    })

    it('should handle null and undefined values', () => {
      const obj: any = {}

      defineLazyProperty(obj, 'nullProp', () => {
        return null
      })
      expect(obj.nullProp).toBe(null)

      defineLazyProperty(obj, 'undefinedProp', () => {
        return undefined
      })
      expect(obj.undefinedProp).toBe(undefined)
    })
  })

  describe('descriptor handling', () => {
    it('should use default descriptor options for lazy getter', () => {
      const obj: any = {}
      defineLazyProperty(obj, 'prop', () => {
        return 'value'
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        configurable: true,
        enumerable: false,
        get: expect.any(Function),
        set: undefined,
      })
    })

    it('should allow overriding descriptor options', () => {
      const obj: any = {}

      defineLazyProperty(
        obj,
        'prop',
        () => {
          return 'value'
        },
        {
          enumerable: true,
          configurable: false,
        },
      )

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        configurable: false,
        enumerable: true,
        get: expect.any(Function),
        set: undefined,
      })
    })
  })

  describe('context binding', () => {
    it('should maintain proper this context during evaluation', () => {
      const obj: any = {
        name: 'test-object',
        getValue() {
          return this.name
        },
      }

      defineLazyProperty(obj, 'computed', function (this: any) {
        return `computed-${this.name}`
      })

      expect(obj.computed).toBe('computed-test-object')
    })

    it('should work with class instances', () => {
      class TestClass {
        constructor(public value: string) {}

        getComputedValue() {
          return `computed-${this.value}`
        }
      }

      const instance: any = new TestClass('instance-value')

      defineLazyProperty(instance, 'lazy', function (this: TestClass) {
        return this.getComputedValue()
      })

      expect(instance.lazy).toBe('computed-instance-value')
    })
  })

  describe('edge cases', () => {
    it('should handle getter that throws on first call', () => {
      const obj: any = {}

      defineLazyProperty(obj, 'throwing', () => {
        throw new Error('computation failed')
      })

      expect(() => {
        return obj.throwing
      }).toThrow('computation failed')

      // Should still throw on subsequent accesses since caching failed
      expect(() => {
        return obj.throwing
      }).toThrow('computation failed')
    })

    it('should work with multiple lazy properties on same object', () => {
      const obj: any = {}
      let callCount1 = 0
      let callCount2 = 0

      defineLazyProperty(obj, 'lazy1', () => {
        callCount1++
        return 'value1'
      })

      defineLazyProperty(obj, 'lazy2', () => {
        callCount2++
        return 'value2'
      })

      expect(obj.lazy1).toBe('value1')
      expect(callCount1).toBe(1)
      expect(callCount2).toBe(0)

      expect(obj.lazy2).toBe('value2')
      expect(callCount1).toBe(1)
      expect(callCount2).toBe(1)

      // Both cached now
      expect(obj.lazy1).toBe('value1')
      expect(obj.lazy2).toBe('value2')
      expect(callCount1).toBe(1)
      expect(callCount2).toBe(1)
    })
  })
})
