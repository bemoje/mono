import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { transformReturnValue } from './transformReturnValue'

describe(transformReturnValue.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic transformation example
      function getNumber(): number {
        return 42
      }

      const toString = transformReturnValue(getNumber, (value) => String(value))
      const result = toString()

      assert.deepStrictEqual(result, '42', 'number transformed to string')

      // Chaining transformations
      const addExclamation = transformReturnValue(toString, (value) => value + '!')
      const finalResult = addExclamation()

      assert.deepStrictEqual(finalResult, '42!', 'chained transformations work')
    }).not.toThrow()
  })

  describe('basic transformations', () => {
    it('should transform return value using provided function', () => {
      const originalFn = vi.fn(() => 10)
      const transformer = vi.fn((x: number) => x * 2)
      const transformedFn = transformReturnValue(originalFn, transformer)

      const result = transformedFn()

      expect(result).toBe(20)
      expect(originalFn).toHaveBeenCalledTimes(1)
      expect(transformer).toHaveBeenCalledWith(10)
    })

    it('should preserve function arguments', () => {
      const originalFn = vi.fn((a: string, b: number) => `${a}:${b}`)
      const transformer = vi.fn((value: string) => value.toUpperCase())
      const transformedFn = transformReturnValue(originalFn, transformer)

      const result = transformedFn('test', 123)

      expect(result).toBe('TEST:123')
      expect(originalFn).toHaveBeenCalledWith('test', 123)
      expect(transformer).toHaveBeenCalledWith('test:123')
    })

    it('should preserve this context', () => {
      class TestClass {
        multiplier = 5

        getValue(base: number) {
          return base * this.multiplier
        }
      }

      const instance = new TestClass()
      const transformer = (value: number) => value + 100
      const transformedMethod = transformReturnValue(instance.getValue, transformer)

      const result = transformedMethod.call(instance, 3)

      expect(result).toBe(115) // (3 * 5) + 100
    })
  })

  describe('different value types', () => {
    it('should handle string transformations', () => {
      const getText = () => 'hello world'
      const toUpper = transformReturnValue(getText, (s) => s.toUpperCase())
      const addPrefix = transformReturnValue(toUpper, (s) => `PREFIX: ${s}`)

      expect(toUpper()).toBe('HELLO WORLD')
      expect(addPrefix()).toBe('PREFIX: HELLO WORLD')
    })

    it('should handle array transformations', () => {
      const getArray = () => [1, 2, 3, 4, 5]
      const evenOnly = transformReturnValue(getArray, (arr) => arr.filter((x) => x % 2 === 0))
      const doubled = transformReturnValue(evenOnly, (arr) => arr.map((x) => x * 2))

      expect(evenOnly()).toEqual([2, 4])
      expect(doubled()).toEqual([4, 8])
    })

    it('should handle object transformations', () => {
      const getUser = () => ({ name: 'John', age: 30 })
      const addEmail = transformReturnValue(getUser, (user) => ({
        ...user,
        email: `${user.name.toLowerCase()}@example.com`,
      }))

      expect(addEmail()).toEqual({
        name: 'John',
        age: 30,
        email: 'john@example.com',
      })
    })

    it('should handle null and undefined', () => {
      const returnNull = () => null
      const returnUndefined = () => undefined

      const nullToEmpty = transformReturnValue(returnNull, (value) => value ?? 'empty')
      const undefinedToZero = transformReturnValue(returnUndefined, (value) => value ?? 0)

      expect(nullToEmpty()).toBe('empty')
      expect(undefinedToZero()).toBe(0)
    })
  })

  describe('complex transformations', () => {
    it('should handle promise transformations', async () => {
      const asyncFn = async () => 'async result'
      const addTimestamp = transformReturnValue(asyncFn, async (promise) => {
        const result = await promise
        return `${result} at ${Date.now()}`
      })

      const result = await addTimestamp()
      expect(result).toMatch(/^async result at \d+$/)
    })

    it('should handle nested transformations', () => {
      const getData = () => ({ items: [1, 2, 3], metadata: { count: 3 } })

      const processItems = transformReturnValue(getData, (data) => ({
        ...data,
        items: data.items.map((x) => x * 10),
      }))

      const addSummary = transformReturnValue(processItems, (data) => ({
        ...data,
        summary: `${data.metadata.count} items processed`,
      }))

      expect(addSummary()).toEqual({
        items: [10, 20, 30],
        metadata: { count: 3 },
        summary: '3 items processed',
      })
    })

    it('should handle error transformation', () => {
      const throwingFn = () => {
        throw new Error('Original error')
      }

      const errorToValue = transformReturnValue(throwingFn, () => 'fallback')

      // Note: this won't work as expected because the original function throws
      // before the transformer can run. This demonstrates a limitation.
      expect(() => errorToValue()).toThrow('Original error')
    })
  })

  describe('function metadata preservation', () => {
    it('should preserve original function name', () => {
      function namedFunction() {
        return 'result'
      }

      const transformed = transformReturnValue(namedFunction, (x) => x.toUpperCase())

      expect(transformed.name).toBe('namedFunction')
    })

    it('should preserve function length (arity)', () => {
      function threeParams(a: string, b: number, c: boolean) {
        return { a, b, c }
      }

      const transformed = transformReturnValue(threeParams, (obj) => JSON.stringify(obj))

      expect(transformed.length).toBe(3)
    })
  })

  describe('performance and reusability', () => {
    it('should create reusable transformed functions', () => {
      const add = (a: number, b: number) => a + b
      const addAndStringify = transformReturnValue(add, (result) => `Result: ${result}`)

      expect(addAndStringify(2, 3)).toBe('Result: 5')
      expect(addAndStringify(10, 20)).toBe('Result: 30')
      expect(addAndStringify(-5, 8)).toBe('Result: 3')
    })

    it('should work with different transformer functions', () => {
      const getValue = () => 100

      const double = transformReturnValue(getValue, (x) => x * 2)
      const square = transformReturnValue(getValue, (x) => x * x)
      const negate = transformReturnValue(getValue, (x) => -x)

      expect(double()).toBe(200)
      expect(square()).toBe(10000)
      expect(negate()).toBe(-100)
    })
  })
})
