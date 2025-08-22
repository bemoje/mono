import { constructorOf } from './constructorOf'
import { Constructor } from 'type-fest'
import { describe, expect, it } from 'vitest'

describe(constructorOf.name, () => {
  it('should return the constructor of a given object', () => {
    class TestClass {}
    const instance = new TestClass()
    const constructor: Constructor<TestClass> = constructorOf(instance)
    expect(constructor.name).toBe('TestClass')
  })

  it('should return the constructor of a string', () => {
    expect(constructorOf('hello')).toBe(String)
  })

  it('should return the constructor of a number', () => {
    expect(constructorOf(42)).toBe(Number)
  })

  it('should return the constructor of a boolean', () => {
    expect(constructorOf(true)).toBe(Boolean)
  })

  it('should return the constructor of an object', () => {
    expect(constructorOf({})).toBe(Object)
  })
})
