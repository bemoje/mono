import { describe, expect, it } from 'vitest'
import { isMethodValueDescriptor } from './isMethodValueDescriptor'

describe(isMethodValueDescriptor.name, () => {
  it('examples', () => {
    expect(() => {
      // A method descriptor example
      const methodDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'push')

      // A non-method value descriptor
      const valueDescriptor = {
        value: 42,
        writable: true,
        enumerable: true,
        configurable: true,
      }

      // A getter descriptor
      const getterDescriptor = {
        get: () => 42,
        enumerable: true,
        configurable: true,
      }

      // Function prototype descriptor
      const funcProtoDescriptor = {
        value: Function.prototype,
        writable: true,
        enumerable: true,
        configurable: true,
      }
    }).not.toThrow()
  })

  it('should return true for method descriptors', () => {
    const methodDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'push')
    expect(isMethodValueDescriptor(methodDescriptor!)).toBe(true)

    const objectMethod = {
      value: function () {
        return 'hello'
      },
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(objectMethod)).toBe(true)
  })

  it('should return false for non-function value descriptors', () => {
    const valueDescriptor = {
      value: 42,
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(valueDescriptor)).toBe(false)

    const stringValueDescriptor = {
      value: 'hello',
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(stringValueDescriptor)).toBe(false)
  })

  it('should return false for accessor descriptors', () => {
    const getterDescriptor = {
      get: () => 42,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(getterDescriptor)).toBe(false)

    const accessorDescriptor = {
      get: () => 42,
      set: (v: number) => {},
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(accessorDescriptor)).toBe(false)
  })

  it('should return false for Function.prototype as value', () => {
    const funcProtoDescriptor = {
      value: Function.prototype,
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(funcProtoDescriptor)).toBe(false)
  })

  it('should return true for arrow functions and class methods', () => {
    const arrowFuncDescriptor = {
      value: () => 'arrow',
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isMethodValueDescriptor(arrowFuncDescriptor)).toBe(true)

    class TestClass {
      method() {
        return 'method'
      }
    }
    const classMethodDescriptor = Object.getOwnPropertyDescriptor(TestClass.prototype, 'method')
    expect(isMethodValueDescriptor(classMethodDescriptor!)).toBe(true)
  })
})
