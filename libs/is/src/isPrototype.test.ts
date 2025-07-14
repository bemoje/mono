import { isPrototype } from './isPrototype'
import { describe, expect, it } from 'vitest'

describe('isPrototype', () => {
  it('should return true for native class prototypes', () => {
    expect(isPrototype(Object.prototype)).toBe(true)
    expect(isPrototype(Function.prototype)).toBe(true)
    expect(isPrototype(Array.prototype)).toBe(true)
  })
  it('should return false for native class constructors', () => {
    expect(isPrototype(Object)).toBe(false)
    expect(isPrototype(Function)).toBe(false)
    expect(isPrototype(Array)).toBe(false)
  })
  it('should return true for created prototypes', () => {
    expect(isPrototype(class A {}.prototype)).toBe(true)
    expect(isPrototype(function A() {}.prototype)).toBe(true)
    expect(isPrototype(Object.getPrototypeOf(Object.create(Object.prototype)))).toBe(true)
    expect(isPrototype(Object.getPrototypeOf({}))).toBe(true)
  })
  it('should return false for created prototypes constructors', () => {
    expect(isPrototype(class A {})).toBe(false)
    expect(isPrototype(function A() {})).toBe(false)
  })

  it('should return false for null', () => {
    expect(isPrototype(null)).toBe(false)
  })

  it('should return false for non-object types', () => {
    expect(isPrototype(123)).toBe(false)
    expect(isPrototype('string')).toBe(false)
    expect(isPrototype(true)).toBe(false)
    expect(isPrototype(undefined)).toBe(false)
  })

  it('should return false for objects without a constructor', () => {
    expect(isPrototype(Object.create(null))).toBe(false)
  })

  it('should return false for objects where prototype does not equal the object', () => {
    expect(isPrototype({})).toBe(false)
  })
})
