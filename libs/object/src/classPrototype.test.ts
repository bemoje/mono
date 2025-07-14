import { classPrototype } from './classPrototype'
import { describe, expect, it } from 'vitest'

describe(classPrototype.name, () => {
  it('should return the class prototype object for a class constructor', () => {
    class MyClass {}
    const result = classPrototype(MyClass)
    expect(result).toBe(MyClass.prototype)
  })

  it('should return the input object for a class prototype object', () => {
    class MyClass {}
    const myClassPrototype = MyClass.prototype
    const result = classPrototype(myClassPrototype)
    expect(result).toBe(myClassPrototype)
  })

  it("should return the constructor's prototype for a class instance", () => {
    class MyClass {}
    const myClassInstance = new MyClass()
    const result = classPrototype(myClassInstance)
    expect(result).toBe(MyClass.prototype)
  })

  it("should return the constructor's prototype for a primitive value", () => {
    const value = 123
    const result = classPrototype(value)
    expect(result).toBe(Number.prototype)
  })

  it('should throw a TypeError for null or undefined', () => {
    expect(() => classPrototype(null as unknown as object)).toThrow(TypeError)
    expect(() => classPrototype(undefined as unknown as object)).toThrow(TypeError)
  })
})
