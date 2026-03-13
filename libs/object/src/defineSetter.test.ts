import assert from 'assert'
import { defineSetter } from './defineSetter'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(defineSetter.name, () => {
  it('examples', () => {
    expect(() => {
      const obj: any = { _value: 'initial' }

      // Basic setter definition
      defineSetter(obj, 'value', function (this: any, newValue: string) {
        this._value = newValue
      })

      obj.value = 'updated'
      assert.strictEqual(obj._value, 'updated')

      // Setter with custom descriptor options
      let stored = ''
      defineSetter(
        obj,
        'tracked',
        (value: string) => {
          stored = `tracked-${value}`
        },
        { enumerable: true }
      )

      obj.tracked = 'test'
      assert.strictEqual(stored, 'tracked-test')
      assert.strictEqual(Object.propertyIsEnumerable.call(obj, 'tracked'), true)

      // Attempting to read from setter-only property returns undefined
      assert.strictEqual(obj.value, undefined)
      assert.strictEqual(obj.tracked, undefined)
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should define a setter property on an object', () => {
      const obj: any = {}
      let called = false
      let receivedValue: any

      defineSetter(obj, 'test', (value) => {
        called = true
        receivedValue = value
      })

      obj.test = 'setter-value'

      expect(called).toBe(true)
      expect(receivedValue).toBe('setter-value')
    })

    it('should return the modified object', () => {
      const obj: any = {}
      const result = defineSetter(obj, 'prop', () => {})

      expect(result).toBe(obj)
    })

    it('should work with symbol keys', () => {
      const obj: any = {}
      const sym = Symbol('setter')
      let value: any

      defineSetter(obj, sym, (v) => {
        value = v
      })

      obj[sym] = 'symbol-value'
      expect(value).toBe('symbol-value')
    })

    it('should work with number keys', () => {
      const obj: any = {}
      let value: any

      defineSetter(obj, 42, (v) => {
        value = v
      })

      obj[42] = 'number-key'
      expect(value).toBe('number-key')
    })

    it('should return undefined when reading setter-only property', () => {
      const obj: any = {}

      defineSetter(obj, 'writeOnly', () => {})

      expect(obj.writeOnly).toBe(undefined)
    })
  })

  describe('descriptor handling', () => {
    it('should use default descriptor options', () => {
      const obj: any = {}
      const setterFn = () => {}

      defineSetter(obj, 'prop', setterFn)

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({ configurable: true, enumerable: false, set: setterFn, get: undefined })
    })

    it('should allow overriding descriptor options', () => {
      const obj: any = {}
      const setterFn = () => {}

      defineSetter(obj, 'prop', setterFn, { enumerable: true, configurable: false })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')

      expect(descriptor).toMatchObject({ configurable: false, enumerable: true, set: setterFn, get: undefined })
    })

    it('should allow adding a getter alongside the setter', () => {
      const obj: any = {}
      let storedValue = 'initial'

      // Use defineProperty for both getter and setter
      Object.defineProperty(obj, 'prop', {
        get: () => {
          return storedValue
        },
        set: (value: string) => {
          storedValue = value
        },
        configurable: true,
        enumerable: false,
      })

      expect(obj.prop).toBe('initial')
      obj.prop = 'updated'
      expect(obj.prop).toBe('updated')
    })
  })

  describe('setter execution', () => {
    it('should call setter function each time property is assigned', () => {
      const obj: any = {}
      let callCount = 0
      const values: any[] = []

      defineSetter(obj, 'counter', (value) => {
        callCount++
        values.push(value)
      })

      obj.counter = 'first'
      obj.counter = 'second'
      obj.counter = 'third'

      expect(callCount).toBe(3)
      expect(values).toEqual(['first', 'second', 'third'])
    })

    it('should maintain setter context', () => {
      const obj: any = { prefix: 'stored' }

      defineSetter(obj, 'value', function (this: any, value) {
        this.result = `${this.prefix}-${value}`
      })

      obj.value = 'input'
      expect(obj.result).toBe('stored-input')
    })

    it('should handle different value types', () => {
      const obj: any = {}
      const receivedValues: any[] = []

      defineSetter(obj, 'universal', (value) => {
        receivedValues.push(value)
      })

      obj.universal = 'string'
      obj.universal = 42
      obj.universal = true
      obj.universal = { object: true }
      obj.universal = [1, 2, 3]
      obj.universal = null
      obj.universal = undefined

      expect(receivedValues).toEqual(['string', 42, true, { object: true }, [1, 2, 3], null, undefined])
    })
  })

  describe('this context', () => {
    it('should maintain this context when setter is called', () => {
      const obj: any = { name: 'test-object', values: [] }

      defineSetter(obj, 'addValue', function (this: any, value) {
        this.values.push(`${this.name}-${value}`)
      })

      obj.addValue = 'first'
      obj.addValue = 'second'

      expect(obj.values).toEqual(['test-object-first', 'test-object-second'])
    })

    it('should work with class instances', () => {
      class TestClass {
        public stored: string = 'initial'
        constructor(public name: string) {}
      }

      const instance: any = new TestClass('instance')

      defineSetter(instance, 'custom', function (this: TestClass, value: string) {
        this.stored = `${this.name}-${value}`
      })

      instance.custom = 'value'
      expect(instance.stored).toBe('instance-value')
    })
  })

  describe('validation and transformation', () => {
    it('should allow value validation in setter', () => {
      const obj: any = { validValue: null }

      defineSetter(obj, 'validated', function (this: any, value: any) {
        if (typeof value !== 'string') {
          throw new TypeError('Value must be a string')
        }
        this.validValue = value.toUpperCase()
      })

      obj.validated = 'hello'
      expect(obj.validValue).toBe('HELLO')

      expect(() => {
        obj.validated = 123
      }).toThrow(TypeError)
    })

    it('should allow value transformation in setter', () => {
      const obj: any = { transformed: null }

      defineSetter(obj, 'input', function (this: any, value) {
        this.transformed = String(value).split('').reverse().join('')
      })

      obj.input = 'hello'
      expect(obj.transformed).toBe('olleh')
    })
  })

  describe('edge cases', () => {
    it('should work with existing objects that have properties', () => {
      const obj: any = { existing: 'prop' }
      let setValue: any

      defineSetter(obj, 'setter', (value) => {
        setValue = value
      })

      expect(obj.existing).toBe('prop')
      obj.setter = 'new-value'
      expect(setValue).toBe('new-value')
    })

    it('should handle setter that throws', () => {
      const obj: any = {}

      defineSetter(obj, 'throwing', () => {
        throw new Error('setter error')
      })

      expect(() => {
        obj.throwing = 'any-value'
      }).toThrow('setter error')
    })

    it('should work with arrow function setters', () => {
      const obj: any = {}
      let value: any

      const arrowSetter = (v: any) => {
        value = v
      }
      defineSetter(obj, 'arrow', arrowSetter)

      obj.arrow = 'arrow-value'
      expect(value).toBe('arrow-value')
    })
  })
})
