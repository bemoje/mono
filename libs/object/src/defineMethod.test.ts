import assert from 'node:assert'
import { defineMethod } from './defineMethod'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(defineMethod.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = {}

      // Basic method definition
      defineMethod(obj, 'greet', function (name: string) {
        return `Hello, ${name}!`
      })
      assert.strictEqual(obj.greet('World'), 'Hello, World!')

      // Method with custom descriptor options
      defineMethod(
        obj,
        'compute',
        () => {
          return 42
        },
        { enumerable: true },
      )
      assert.strictEqual(obj.compute(), 42)
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'compute'), true)

      // Non-writable method
      defineMethod(
        obj,
        'constant',
        () => {
          return 'fixed'
        },
        { writable: false },
      )
      assert.strictEqual(obj.constant(), 'fixed')

      // Attempting to overwrite should throw in strict mode
      assert.throws(() => {
        obj.constant = () => {
          return 'changed'
        }
      }, TypeError)
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define a method property on an object', () => {
      const obj: any = {}
      const methodFn = function (x: number) {
        return x * 2
      }

      defineMethod(obj, 'double', methodFn)

      expect(obj.double).toBe(methodFn)
      expect(obj.double(5)).toBe(10)
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineMethod(obj, 'method', () => {
        return 'value'
      })

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('method')
      const methodFn = () => {
        return 'symbol-method'
      }

      defineMethod(obj, sym, methodFn)

      expect(obj[sym]).toBe(methodFn)
      expect(obj[sym]()).toBe('symbol-method')
    })

    it('should work with number keys', () => {
      const obj: any = {}
      const methodFn = () => {
        return 'number-method'
      }

      defineMethod(obj, 42, methodFn)

      expect(obj[42]).toBe(methodFn)
      expect(obj[42]()).toBe('number-method')
    })
  })

  describe('descriptor handling', () => {
    it('should use default descriptor options', () => {
      const obj: any = {}
      const methodFn = () => {
        return 'value'
      }

      defineMethod(obj, 'prop', methodFn)

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        value: methodFn,
        configurable: true,
        writable: true,
        enumerable: false,
      })
    })

    it('should allow overriding descriptor options', () => {
      const obj: any = {}
      const methodFn = () => {
        return 'value'
      }

      defineMethod(obj, 'prop', methodFn, {
        enumerable: true,
        writable: false,
        configurable: false,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({
        value: methodFn,
        configurable: false,
        writable: false,
        enumerable: true,
      })
    })

    it('should handle value descriptor options', () => {
      const obj: any = {}
      const methodFn = () => {
        return 'test'
      }

      defineMethod(obj, 'method', methodFn, {
        writable: false,
        enumerable: true,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'method')
      expect(descriptor).toBeDefined()
    })
  })

  describe('method types', () => {
    it('should work with regular functions', () => {
      const obj: any = {}

      function namedFunction() {
        return 'named'
      }

      defineMethod(obj, 'named', namedFunction)

      expect(obj.named).toBe(namedFunction)
      expect(obj.named()).toBe('named')
    })

    it('should work with arrow functions', () => {
      const obj: any = {}
      const arrowFn = () => {
        return 'arrow'
      }

      defineMethod(obj, 'arrow', arrowFn)

      expect(obj.arrow).toBe(arrowFn)
      expect(obj.arrow()).toBe('arrow')
    })

    it('should work with bound functions', () => {
      const obj: any = {}
      const context = { value: 'bound' }
      const boundFn = function (this: typeof context) {
        return this.value
      }.bind(context)

      defineMethod(obj, 'bound', boundFn)

      expect(obj.bound).toBe(boundFn)
      expect(obj.bound()).toBe('bound')
    })

    it('should work with async functions', async () => {
      const obj: any = {}
      const asyncFn = async () => {
        return 'async-result'
      }

      defineMethod(obj, 'async', asyncFn)

      expect(obj.async).toBe(asyncFn)
      await expect(obj.async()).resolves.toBe('async-result')
    })

    it('should work with generator functions', () => {
      const obj: any = {}
      const generatorFn = function* () {
        yield 1
        yield 2
        yield 3
      }

      defineMethod(obj, 'generator', generatorFn)

      expect(obj.generator).toBe(generatorFn)
      const iterator = obj.generator()
      expect(iterator.next().value).toBe(1)
      expect(iterator.next().value).toBe(2)
      expect(iterator.next().value).toBe(3)
    })
  })

  describe('this context', () => {
    it('should maintain this context when method is called', () => {
      const obj: any = {
        name: 'test-object',
        value: 42,
      }

      defineMethod(obj, 'getValue', function (this: any) {
        return this.value
      })

      expect(obj.getValue()).toBe(42)
    })

    it('should work with class instances', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const instance: any = new TestClass('instance-value')

      defineMethod(instance, 'custom', function (this: TestClass) {
        return `custom-${this.value}`
      })

      expect(instance.custom()).toBe('custom-instance-value')
    })
  })

  describe('method overriding', () => {
    it('should allow overriding when writable is true', () => {
      const obj: any = {}
      const original = () => {
        return 'original'
      }
      const replacement = () => {
        return 'replacement'
      }

      defineMethod(obj, 'method', original, { writable: true })
      obj.method = replacement

      expect(obj.method).toBe(replacement)
      expect(obj.method()).toBe('replacement')
    })

    it('should prevent overriding when writable is false', () => {
      const obj: any = {}
      const original = () => {
        return 'original'
      }
      const replacement = () => {
        return 'replacement'
      }

      defineMethod(obj, 'method', original, { writable: false })

      expect(() => {
        obj.method = replacement // Should throw in strict mode
      }).toThrow(TypeError)

      expect(obj.method).toBe(original)
      expect(obj.method()).toBe('original')
    })
  })

  describe('edge cases', () => {
    it('should work with existing objects that have properties', () => {
      const obj: any = { existing: 'prop' }
      const methodFn = () => {
        return 'new-method'
      }

      defineMethod(obj, 'method', methodFn)

      expect(obj.existing).toBe('prop')
      expect(obj.method).toBe(methodFn)
    })

    it('should work with non-function values', () => {
      const obj: any = {}
      const value = 'not-a-function'

      defineMethod(obj, 'prop', value)

      expect(obj.prop).toBe(value)
    })

    it('should work with null and undefined values', () => {
      const obj: any = {}

      defineMethod(obj, 'nullProp', null)
      defineMethod(obj, 'undefinedProp', undefined)

      expect(obj.nullProp).toBe(null)
      expect(obj.undefinedProp).toBe(undefined)
    })

    it('should handle complex object values', () => {
      const obj: any = {}
      const complexValue = { nested: { deep: 'value' } }

      defineMethod(obj, 'complex', complexValue)

      expect(obj.complex).toBe(complexValue)
      expect(obj.complex.nested.deep).toBe('value')
    })
  })
})
