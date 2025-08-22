import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { defineProperty } from './defineProperty'

describe(defineProperty.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = {}

      // Value property with default configurable=true
      defineProperty(obj, 'name', { value: 'test', writable: true })
      assert.strictEqual(obj.name, 'test')
      obj.name = 'updated'
      assert.strictEqual(obj.name, 'updated')

      // Getter property
      defineProperty(obj, 'computed', {
        get() {
          return 'computed-value'
        },
        enumerable: true,
      })
      assert.strictEqual(obj.computed, 'computed-value')
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'computed'), true)

      // Getter/setter property
      let stored = 'initial'
      defineProperty(obj, 'dynamic', {
        get() {
          return stored
        },
        set(value) {
          stored = value
        },
        enumerable: false,
      })
      assert.strictEqual(obj.dynamic, 'initial')
      obj.dynamic = 'changed'
      assert.strictEqual(obj.dynamic, 'changed')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define properties with value descriptors', () => {
      const obj: any = {}

      defineProperty(obj, 'prop', {
        value: 'test-value',
        writable: true,
        enumerable: true,
      })

      expect(obj.prop).toBe('test-value')

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor).toMatchObject({
        value: 'test-value',
        writable: true,
        enumerable: true,
        configurable: true, // Default from function
      })
    })

    it('should define properties with accessor descriptors', () => {
      const obj: any = {}
      let internalValue = 'stored'

      defineProperty(obj, 'accessor', {
        get() {
          return internalValue
        },
        set(value) {
          internalValue = value
        },
        enumerable: true,
      })

      expect(obj.accessor).toBe('stored')
      obj.accessor = 'updated'
      expect(obj.accessor).toBe('updated')

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'accessor')
      expect(descriptor).toMatchObject({
        get: expect.any(Function),
        set: expect.any(Function),
        enumerable: true,
        configurable: true,
      })
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineProperty(obj, 'prop', { value: 'test' })

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('test')

      defineProperty(obj, sym, { value: 'symbol-value' })

      expect(obj[sym]).toBe('symbol-value')
    })

    it('should work with number keys', () => {
      const obj: any = {}

      defineProperty(obj, 42, { value: 'number-key' })

      expect(obj[42]).toBe('number-key')
    })
  })

  describe('descriptor defaults', () => {
    it('should default configurable to true', () => {
      const obj: any = {}

      defineProperty(obj, 'prop', { value: 'test' })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor?.configurable).toBe(true)
    })

    it('should allow overriding configurable', () => {
      const obj: any = {}

      defineProperty(obj, 'prop', {
        value: 'test',
        configurable: false,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor?.configurable).toBe(false)
    })

    it('should preserve other descriptor properties', () => {
      const obj: any = {}

      defineProperty(obj, 'prop', {
        value: 'test',
        writable: false,
        enumerable: true,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      expect(descriptor).toMatchObject({
        value: 'test',
        writable: false,
        enumerable: true,
        configurable: true,
      })
    })
  })

  describe('value descriptors', () => {
    it('should handle different value types', () => {
      const obj: any = {}

      // String
      defineProperty(obj, 'str', { value: 'string' })
      expect(obj.str).toBe('string')

      // Number
      defineProperty(obj, 'num', { value: 42 })
      expect(obj.num).toBe(42)

      // Boolean
      defineProperty(obj, 'bool', { value: true })
      expect(obj.bool).toBe(true)

      // Object
      const objValue = { nested: true }
      defineProperty(obj, 'obj', { value: objValue })
      expect(obj.obj).toBe(objValue)

      // Function
      const fnValue = () => 'function'
      defineProperty(obj, 'fn', { value: fnValue })
      expect(obj.fn).toBe(fnValue)
    })

    it('should handle null and undefined values', () => {
      const obj: any = {}

      defineProperty(obj, 'nullProp', { value: null })
      expect(obj.nullProp).toBe(null)

      defineProperty(obj, 'undefinedProp', { value: undefined })
      expect(obj.undefinedProp).toBe(undefined)
    })

    it('should respect writable flag', () => {
      const obj: any = {}

      defineProperty(obj, 'readonly', {
        value: 'cannot-change',
        writable: false,
      })

      expect(() => {
        obj.readonly = 'attempted-change'
      }).toThrow(TypeError)

      expect(obj.readonly).toBe('cannot-change')
    })
  })

  describe('accessor descriptors', () => {
    it('should handle getter-only properties', () => {
      const obj: any = {}

      defineProperty(obj, 'readOnly', {
        get() {
          return 'read-only-value'
        },
      })

      expect(obj.readOnly).toBe('read-only-value')

      expect(() => {
        obj.readOnly = 'attempted-write'
      }).toThrow(TypeError)
    })

    it('should handle setter-only properties', () => {
      const obj: any = {}
      let stored: any

      defineProperty(obj, 'writeOnly', {
        set(value) {
          stored = value
        },
      })

      obj.writeOnly = 'written-value'
      expect(stored).toBe('written-value')
      expect(obj.writeOnly).toBe(undefined) // No getter
    })

    it('should maintain this context in getters and setters', () => {
      const obj: any = {
        _value: 'initial',
      }

      defineProperty(obj, 'controlled', {
        get(this: any) {
          return this._value
        },
        set(this: any, value) {
          this._value = `controlled-${value}`
        },
      })

      expect(obj.controlled).toBe('initial')
      obj.controlled = 'updated'
      expect(obj.controlled).toBe('controlled-updated')
    })
  })

  describe('enumerable behavior', () => {
    it('should respect enumerable flag for value properties', () => {
      const obj: any = {}

      defineProperty(obj, 'enumerable', {
        value: 'visible',
        enumerable: true,
      })

      defineProperty(obj, 'hidden', {
        value: 'invisible',
        enumerable: false,
      })

      const keys = Object.keys(obj)
      expect(keys).toContain('enumerable')
      expect(keys).not.toContain('hidden')
    })

    it('should respect enumerable flag for accessor properties', () => {
      const obj: any = {}

      defineProperty(obj, 'visibleAccessor', {
        get() {
          return 'visible'
        },
        enumerable: true,
      })

      defineProperty(obj, 'hiddenAccessor', {
        get() {
          return 'hidden'
        },
        enumerable: false,
      })

      const keys = Object.keys(obj)
      expect(keys).toContain('visibleAccessor')
      expect(keys).not.toContain('hiddenAccessor')
    })
  })

  describe('edge cases', () => {
    it('should work with existing objects', () => {
      const obj: any = { existing: 'property' }

      defineProperty(obj, 'new', { value: 'added' })

      expect(obj.existing).toBe('property')
      expect(obj.new).toBe('added')
    })

    it('should work with class instances', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const instance: any = new TestClass('instance')

      defineProperty(instance, 'computed', {
        get(this: TestClass) {
          return `computed-${this.value}`
        },
      })

      expect(instance.computed).toBe('computed-instance')
    })

    it('should handle complex descriptor combinations', () => {
      const obj: any = {}

      defineProperty(obj, 'complex', {
        value: 'initial',
        writable: true,
        enumerable: false,
        configurable: false,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'complex')
      expect(descriptor).toMatchObject({
        value: 'initial',
        writable: true,
        enumerable: false,
        configurable: false,
      })
    })
  })
})
