import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { defineGetter } from './defineGetter'

describe(defineGetter.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = {}

      // Basic getter definition
      defineGetter(obj, 'value', () => 42)
      assert.strictEqual(obj.value, 42)

      // Getter with custom descriptor options
      defineGetter(obj, 'computed', () => 'hello', { enumerable: true })
      assert.strictEqual(obj.computed, 'hello')
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'computed'), true)

      // Getter that can be reconfigured
      defineGetter(obj, 'dynamic', () => 'initial', { configurable: true })
      defineGetter(obj, 'dynamic', () => 'updated')
      assert.strictEqual(obj.dynamic, 'updated')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define a getter property on an object', () => {
      const obj: any = {}
      let called = false

      defineGetter(obj, 'test', () => {
        called = true
        return 'getter-result'
      })

      expect(obj.test).toBe('getter-result')
      expect(called).toBe(true)
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineGetter(obj, 'prop', () => 'value')

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('test')

      defineGetter(obj, sym, () => 'symbol-value')

      expect(obj[sym]).toBe('symbol-value')
    })

    it('should work with number keys', () => {
      const obj: any = {}

      defineGetter(obj, 42, () => 'number-key')

      expect(obj[42]).toBe('number-key')
    })
  })

  describe('descriptor handling', () => {
    it('should use default descriptor options', () => {
      const obj: any = {}
      defineGetter(obj, 'prop', () => 'value')

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

      defineGetter(obj, 'prop', () => 'value', {
        enumerable: true,
        configurable: false,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        configurable: false,
        enumerable: true,
        get: expect.any(Function),
        set: undefined,
      })
    })
  })

  describe('getter execution', () => {
    it('should call getter function each time property is accessed', () => {
      const obj: any = {}
      let callCount = 0

      defineGetter(obj, 'counter', () => ++callCount)

      expect(obj.counter).toBe(1)
      expect(obj.counter).toBe(2)
      expect(obj.counter).toBe(3)
    })

    it('should maintain getter context', () => {
      const obj: any = { name: 'test-object' }

      defineGetter(obj, 'selfName', function (this: any) {
        return this.name
      })

      expect(obj.selfName).toBe('test-object')
    })
  })

  describe('edge cases', () => {
    it('should work with existing objects that have properties', () => {
      const obj: any = { existing: 'prop' }

      defineGetter(obj, 'getter', () => 'new-prop')

      expect(obj.existing).toBe('prop')
      expect(obj.getter).toBe('new-prop')
    })

    it('should work with class instances', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const instance: any = new TestClass('instance-value')
      defineGetter(instance, 'computed', () => `computed-${instance.value}`)

      expect(instance.computed).toBe('computed-instance-value')
    })

    it('should handle getter that throws', () => {
      const obj: any = {}

      defineGetter(obj, 'throwing', () => {
        throw new Error('getter error')
      })

      expect(() => obj.throwing).toThrow('getter error')
    })
  })
})
