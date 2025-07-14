import { describe, expect, test } from 'vitest'
import { getClassChain } from './getClassChain'
import { getSuperClass } from './getSuperClass'
import { getPrototypeChain } from './getPrototypeChain'

describe('refactored class chain functions', () => {
  class A {}
  class B extends A {}
  class C extends B {}

  describe(getClassChain.name, () => {
    test('returns class chain including self', () => {
      expect(getClassChain(C, { includeSelf: true })).toStrictEqual([C, B, A, Object])
    })

    test('returns class chain excluding self (superclasses only)', () => {
      expect(getClassChain(C, { includeSelf: false })).toStrictEqual([B, A, Object])
    })

    test('defaults to excluding self', () => {
      expect(getClassChain(C)).toStrictEqual([B, A, Object])
    })

    test('works with instances', () => {
      const instance = new C()
      expect(getClassChain(instance, { includeSelf: true })).toStrictEqual([C, B, A, Object])
    })
  })

  describe(getSuperClass.name, () => {
    test('returns immediate superclass', () => {
      expect(getSuperClass(C)).toBe(B)
      expect(getSuperClass(B)).toBe(A)
      expect(getSuperClass(A)).toBe(Object)
    })

    test('works with instances', () => {
      const instance = new C()
      expect(getSuperClass(instance)).toBe(B)
    })
  })

  describe(getPrototypeChain.name, () => {
    test('returns prototype chain including self', () => {
      const instance = new C()
      expect(getPrototypeChain(instance, { includeSelf: true })).toStrictEqual([
        instance,
        C.prototype,
        B.prototype,
        A.prototype,
        Object.prototype,
      ])
    })

    test('returns prototype chain excluding self', () => {
      const instance = new C()
      expect(getPrototypeChain(instance, { includeSelf: false })).toStrictEqual([
        C.prototype,
        B.prototype,
        A.prototype,
        Object.prototype,
      ])
    })

    test('works with constructors', () => {
      expect(getPrototypeChain(C, { includeSelf: false })).toStrictEqual([
        B,
        A,
        Function.prototype,
        Object.prototype,
      ])
    })
  })
})
