import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { bindArg } from './bindArg'

describe(bindArg.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic usage - bind second argument
      function greet(greeting: string, name: string, punctuation: string) {
        return `${greeting} ${name}${punctuation}`
      }

      const sayHelloTo = bindArg(greet, 0, 'Hello')
      const result = sayHelloTo('World', '!')

      assert.deepStrictEqual(result, 'Hello World!', 'basic binding')

      // Bind middle argument
      const greetWithComma = bindArg(greet, 2, ',')
      const result2 = greetWithComma('Hi', 'Alice')

      assert.deepStrictEqual(result2, 'Hi Alice,', 'middle argument binding')
    }).not.toThrow()
  })

  describe('argument binding at different positions', () => {
    function testFunction(a: number, b: string, c: boolean, d: symbol) {
      return { a, b, c, d }
    }

    it('should bind first argument', () => {
      const boundFn = bindArg(testFunction, 0, 42)
      const sym = Symbol('sym')
      const result = boundFn('test', true, sym)
      expect(result).toEqual({ a: 42, b: 'test', c: true, d: sym })
    })

    it('should bind second argument', () => {
      const boundFn = bindArg(testFunction, 1, 'bound')
      const sym = Symbol('test')
      const result = boundFn(10, false, sym)
      expect(result).toEqual({ a: 10, b: 'bound', c: false, d: sym })
    })

    it('should bind third argument', () => {
      const boundFn = bindArg(testFunction, 2, true)
      const sym = Symbol('end')
      const result = boundFn(5, 'hello', sym)
      expect(result).toEqual({ a: 5, b: 'hello', c: true, d: sym })
    })

    it('should bind last argument', () => {
      const sym = Symbol('bound')
      const boundFn = bindArg(testFunction, 3, sym)
      const result = boundFn(99, 'final', false)
      expect(result).toEqual({ a: 99, b: 'final', c: false, d: sym })
    })
  })

  describe('edge cases', () => {
    it('should work with functions that have only one argument', () => {
      function singleArg(x: number) {
        return x * 2
      }

      const boundFn = bindArg(singleArg, 0, 5)
      const result = boundFn()
      expect(result).toBe(10)
    })

    it('should preserve function name when possible', () => {
      function namedFunction(a: string, b: number) {
        return `${a}: ${b}`
      }

      const boundFn = bindArg(namedFunction, 0, 'test')
      expect(boundFn.name).toBe(namedFunction.name)
    })

    it('should work with different types of bound values', () => {
      function typeTest(obj: object, arr: unknown[], fn: () => string) {
        return { obj, arr, fn }
      }

      const testObj = { key: 'value' }
      const boundFn = bindArg(typeTest, 0, testObj)
      const testFn = () => 'test'
      const result = boundFn([1, 2, 3], testFn)

      expect(result).toEqual({
        obj: testObj,
        arr: [1, 2, 3],
        fn: testFn,
      })
    })
  })
})
