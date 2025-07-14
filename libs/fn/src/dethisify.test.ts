import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { dethisify } from './dethisify'

describe(dethisify.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic example with method
      class Calculator {
        value = 0

        add(this: Calculator, amount: number) {
          this.value += amount
          return this.value
        }
      }

      const calculator = new Calculator()
      const addFunction = dethisify(calculator.add)

      // Now we can call it with the instance as first argument
      const result = addFunction(calculator, 5)
      assert.deepStrictEqual(result, 5, 'dethisified function works')
      assert.deepStrictEqual(calculator.value, 5, 'state updated correctly')
    }).not.toThrow()
  })

  describe('method conversion', () => {
    it('should convert instance method to standalone function', () => {
      class TestClass {
        private _value: string

        constructor(value: string) {
          this._value = value
        }

        getValue() {
          return this._value
        }

        setValue(newValue: string) {
          this._value = newValue
          return this
        }
      }

      const instance = new TestClass('initial')
      const getValue = dethisify(instance.getValue)
      const setValue = dethisify(instance.setValue)

      expect(getValue(instance)).toBe('initial')

      const result = setValue(instance, 'updated')
      expect(result).toBe(instance)
      expect(getValue(instance)).toBe('updated')
    })

    it('should work with methods that have multiple parameters', () => {
      class MathHelper {
        multiplier: number

        constructor(multiplier: number) {
          this.multiplier = multiplier
        }

        calculate(a: number, b: number, operation: 'add' | 'multiply'): number {
          const base = operation === 'add' ? a + b : a * b
          return base * this.multiplier
        }
      }

      const helper = new MathHelper(2)
      const calculate = dethisify(helper.calculate)

      expect(calculate(helper, 3, 4, 'add')).toBe(14) // (3+4) * 2
      expect(calculate(helper, 3, 4, 'multiply')).toBe(24) // (3*4) * 2
    })

    it('should preserve function name and length', () => {
      class Example {
        exampleMethod(param1: string, param2: number) {
          return `${param1}-${param2}`
        }
      }

      const instance = new Example()
      const dethisified = dethisify(instance.exampleMethod)

      expect(dethisified.name).toBe('exampleMethod')
      expect(dethisified.length).toBe(3) // original function has 2 params
    })
  })

  describe('built-in method conversion', () => {
    it('should work with Array methods', () => {
      const push = dethisify(Array.prototype.push)
      const arr = [1, 2, 3]

      const newLength = push(arr, 4, 5)
      expect(newLength).toBe(5)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })

    it('should work with String methods', () => {
      const slice = dethisify(String.prototype.slice)
      const str = new String('hello world') // Use String object instead of primitive

      expect(slice(str, 0, 5)).toBe('hello')
      expect(slice(str, 6)).toBe('world')
    })

    it('should work with Object methods', () => {
      const hasOwnProperty = dethisify(Object.prototype.hasOwnProperty)
      const obj = { a: 1, b: 2 }

      expect(hasOwnProperty(obj, 'a')).toBe(true)
      expect(hasOwnProperty(obj, 'c')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle methods that return this', () => {
      class FluentInterface {
        private _value = ''

        append(text: string) {
          this._value += text
          return this
        }

        getValue() {
          return this._value
        }
      }

      const instance = new FluentInterface()
      const append = dethisify(instance.append)
      const getValue = dethisify(instance.getValue)

      const result = append(instance, 'test')
      expect(result).toBe(instance)
      expect(getValue(instance)).toBe('test')
    })

    it('should handle async methods', async () => {
      class AsyncClass {
        async getData(delay: number) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          return 'data'
        }
      }

      const instance = new AsyncClass()
      const getData = dethisify(instance.getData)

      const result = await getData(instance, 1)
      expect(result).toBe('data')
    })

    it('should handle methods with no parameters', () => {
      class Simple {
        getValue() {
          return 42
        }
      }

      const instance = new Simple()
      const getValue = dethisify(instance.getValue)

      expect(getValue(instance)).toBe(42)
    })
  })
})
