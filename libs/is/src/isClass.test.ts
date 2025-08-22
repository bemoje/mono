import { isClass } from './isClass'
import { describe, expect, it } from 'vitest'

describe(isClass.name, () => {
  describe('true', () => {
    it('class constructor', () => {
      class C {}
      expect(isClass(C)).toBe(true)

      abstract class A {}
      expect(isClass(A)).toBe(true)
    })

    it('minification, mangling, other edge-cases', () => {
      const valid = [
        'abstract class A {}',
        'class A {}',
        'abstract class A {}',
        'abstract class {}',
        'class A {}',
        'class A {}',
        '  class  A  {',
        '\tclass\tA\t{',
        '\nclass\nA\n{',
        'class {}',
        'class A{}',
        'class {}',
        'class{}',
      ]
      for (const code of valid) {
        const mock = Object.defineProperty(new Function(), 'toString', { value: () => code })
        expect(isClass(mock)).toBe(true)
      }
    })
  })

  describe('false', () => {
    it('built-in constructors', () => {
      expect(isClass(Function)).toBe(false)
      expect(isClass(Array)).toBe(false)
    })

    it('new Function()', () => {
      expect(isClass(new Function())).toBe(false)
    })

    it('named function', () => {
      expect(isClass(function () {})).toBe(false)
    })

    it('arrow function', () => {
      expect(isClass(() => {})).toBe(false)
    })

    it('prototype objects', () => {
      expect(isClass(Function.prototype)).toBe(false)
      expect(isClass(Array.prototype)).toBe(false)
    })

    it('bound constructors', function () {
      const clazz = { method() {} }
      clazz.method = clazz.method.bind(clazz)
      expect(isClass(clazz.method)).toBe(false)
    })

    it('function with prototype not being a prototype-object', () => {
      function Test() {
        //
      }
      Test.prototype = {}
      expect(isClass(Test)).toBe(false)
    })

    it('primitives', () => {
      expect(isClass(null)).toBe(false)
      expect(isClass(undefined)).toBe(false)
      expect(isClass(1)).toBe(false)
      expect(isClass('string')).toBe(false)
      expect(isClass(false)).toBe(false)
    })

    it('minification, mangling, other edge-cases', () => {
      const invalid = [
        'abstractclass A {}', //
        'classA {}',
      ]
      for (const code of invalid) {
        const mock = Object.defineProperty(new Function(), 'toString', { value: () => code })
        expect(isClass(mock)).toBe(false)
      }
    })
  })
})
