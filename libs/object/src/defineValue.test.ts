import assert from 'assert'
import { defineValue } from './defineValue'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(defineValue.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = {}

      // Basic value definition with defaults (enumerable=true, configurable=true)
      defineValue(obj, 'name', 'test-value')
      assert.strictEqual(obj.name, 'test-value')
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'name'), true)

      // Value with custom descriptor options
      defineValue(obj, 'hidden', 'secret', { enumerable: false, writable: false })
      assert.strictEqual(obj.hidden, 'secret')
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'hidden'), false)

      // Attempting to change non-writable property should throw
      assert.throws(() => {
        obj.hidden = 'changed'
      }, TypeError)

      // Value can be modified if writable is explicitly set
      defineValue(obj, 'writable', 'initial', { writable: true })
      obj.writable = 'updated'
      assert.strictEqual(obj.writable, 'updated')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define a value property on an object', () => {
      const obj: any = {}
      const value = 'test-value'

      defineValue(obj, 'prop', value)

      expect(obj.prop).toBe(value)
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineValue(obj, 'prop', 'value')

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('test')

      defineValue(obj, sym, 'symbol-value')

      expect(obj[sym]).toBe('symbol-value')
    })

    it('should work with number keys', () => {
      const obj: any = {}

      defineValue(obj, 42, 'number-key')

      expect(obj[42]).toBe('number-key')
    })
  })

  describe('descriptor defaults', () => {
    it('should use default descriptor options', () => {
      const obj: any = {}
      const value = 'test'

      defineValue(obj, 'prop', value)

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        value: value,
        configurable: true,
        enumerable: true,
        writable: false, // Default for Object.defineProperty when only value is set
      })
    })

    it('should allow overriding descriptor options', () => {
      const obj: any = {}

      defineValue(obj, 'prop', 'test', { enumerable: false, writable: false, configurable: false })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({ value: 'test', configurable: false, writable: false, enumerable: false })
    })
  })

  describe('value types', () => {
    it('should handle different value types', () => {
      const obj: any = {}

      // String
      defineValue(obj, 'str', 'string-value')
      expect(obj.str).toBe('string-value')

      // Number
      defineValue(obj, 'num', 42)
      expect(obj.num).toBe(42)

      // Boolean
      defineValue(obj, 'bool', true)
      expect(obj.bool).toBe(true)

      // Object
      const objValue = { nested: 'value' }
      defineValue(obj, 'obj', objValue)
      expect(obj.obj).toBe(objValue)

      // Function
      const fnValue = () => {
        return 'function-result'
      }
      defineValue(obj, 'fn', fnValue)
      expect(obj.fn).toBe(fnValue)

      // Array
      const arrValue = [1, 2, 3]
      defineValue(obj, 'arr', arrValue)
      expect(obj.arr).toBe(arrValue)
    })

    it('should handle null and undefined values', () => {
      const obj: any = {}

      defineValue(obj, 'nullProp', null)
      expect(obj.nullProp).toBe(null)

      defineValue(obj, 'undefinedProp', undefined)
      expect(obj.undefinedProp).toBe(undefined)
    })

    it('should handle complex objects', () => {
      const obj: any = {}
      const complexValue = { nested: { deep: { value: 'deeply-nested' } }, array: [1, 2, { inner: true }] }

      defineValue(obj, 'complex', complexValue)

      expect(obj.complex).toBe(complexValue)
      expect(obj.complex.nested.deep.value).toBe('deeply-nested')
      expect(obj.complex.array[2].inner).toBe(true)
    })
  })

  describe('writable behavior', () => {
    it('should allow modification when writable is explicitly true', () => {
      const obj: any = {}

      defineValue(obj, 'prop', 'initial', { writable: true })

      obj.prop = 'modified'
      expect(obj.prop).toBe('modified')
    })

    it('should prevent modification when writable is false', () => {
      const obj: any = {}

      defineValue(obj, 'readonly', 'constant', { writable: false })

      expect(() => {
        obj.readonly = 'attempted-change'
      }).toThrow(TypeError)

      expect(obj.readonly).toBe('constant')
    })

    it('should handle writable flag with different value types', () => {
      const obj: any = {}

      defineValue(obj, 'readonlyObj', { immutable: true }, { writable: false })
      defineValue(obj, 'readonlyArr', [1, 2, 3], { writable: false })

      expect(() => {
        obj.readonlyObj = { different: true }
      }).toThrow(TypeError)

      expect(() => {
        obj.readonlyArr = [4, 5, 6]
      }).toThrow(TypeError)

      expect(obj.readonlyObj).toEqual({ immutable: true })
      expect(obj.readonlyArr).toEqual([1, 2, 3])
    })
  })

  describe('enumerable behavior', () => {
    it('should be enumerable by default', () => {
      const obj: any = {}

      defineValue(obj, 'visible', 'value')

      const keys = Object.keys(obj)
      expect(keys).toContain('visible')
      expect(Object.propertyIsEnumerable.call(obj, 'visible')).toBe(true)
    })

    it('should respect enumerable false', () => {
      const obj: any = {}

      defineValue(obj, 'hidden', 'value', { enumerable: false })

      const keys = Object.keys(obj)
      expect(keys).not.toContain('hidden')
      expect(Object.propertyIsEnumerable.call(obj, 'hidden')).toBe(false)

      // But still accessible
      expect(obj.hidden).toBe('value')
    })

    it('should handle mixed enumerable properties', () => {
      const obj: any = {}

      defineValue(obj, 'visible1', 'value1', { enumerable: true })
      defineValue(obj, 'hidden1', 'value1', { enumerable: false })
      defineValue(obj, 'visible2', 'value2') // Default enumerable: true
      defineValue(obj, 'hidden2', 'value2', { enumerable: false })

      const keys = Object.keys(obj)
      expect(keys).toEqual(['visible1', 'visible2'])

      // All properties still accessible
      expect(obj.visible1).toBe('value1')
      expect(obj.hidden1).toBe('value1')
      expect(obj.visible2).toBe('value2')
      expect(obj.hidden2).toBe('value2')
    })
  })

  describe('configurable behavior', () => {
    it('should be configurable by default', () => {
      const obj: any = {}

      defineValue(obj, 'prop', 'initial')

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor?.configurable).toBe(true)

      // Should be able to redefine
      defineValue(obj, 'prop', 'redefined')
      expect(obj.prop).toBe('redefined')
    })

    it('should respect configurable false', () => {
      const obj: any = {}

      defineValue(obj, 'fixed', 'value', { configurable: false })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'fixed')
      expect(descriptor?.configurable).toBe(false)

      // Should not be able to redefine
      expect(() => {
        defineValue(obj, 'fixed', 'new-value')
      }).toThrow(TypeError)
    })
  })

  describe('edge cases', () => {
    it('should work with existing objects that have properties', () => {
      const obj: any = { existing: 'property' }

      defineValue(obj, 'new', 'added-value')

      expect(obj.existing).toBe('property')
      expect(obj.new).toBe('added-value')
    })

    it('should work with class instances', () => {
      class TestClass {
        constructor(public existing: string) {}
      }

      const instance: any = new TestClass('original')

      defineValue(instance, 'added', 'new-property')

      expect(instance.existing).toBe('original')
      expect(instance.added).toBe('new-property')
    })

    it('should handle property replacement on existing property', () => {
      const obj: any = { existing: 'original' }

      // This should replace the existing property
      defineValue(obj, 'existing', 'replaced')

      expect(obj.existing).toBe('replaced')

      // Check the descriptor was properly set
      const descriptor = Object.getOwnPropertyDescriptor(obj, 'existing')
      expect(descriptor).toMatchObject({ value: 'replaced', configurable: true, enumerable: true, writable: true })
    })

    it('should work with property names that are JavaScript keywords', () => {
      const obj: any = {}

      defineValue(obj, 'constructor', 'custom-constructor')
      defineValue(obj, 'toString', 'custom-toString')

      expect(obj.constructor).toBe('custom-constructor')
      expect(obj.toString).toBe('custom-toString')
    })
  })
})
