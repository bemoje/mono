import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { isAccessorDescriptor } from './isAccessorDescriptor'

describe(isAccessorDescriptor.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = {}
      Object.defineProperty(obj, 'prop', {
        get: () => 'value',
        enumerable: true,
        configurable: true,
      })

      const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop')
      const isAccessor = isAccessorDescriptor(descriptor)

      expect(isAccessor).toBe(true)
    }).not.toThrow()
  })

  it('should return false for undefined descriptor', () => {
    expect(isAccessorDescriptor(undefined)).toBe(false)
  })

  it('should return false for descriptor without getter or setter', () => {
    const descriptor: PropertyDescriptor = {
      value: 'test',
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isAccessorDescriptor(descriptor)).toBe(false)
  })

  it('should return false for descriptor with writable property', () => {
    const descriptor: PropertyDescriptor = {
      get: () => 'test',
      writable: true,
      enumerable: true,
      configurable: true,
    }
    expect(isAccessorDescriptor(descriptor)).toBe(false)
  })

  it('should return true for descriptor with getter only', () => {
    const descriptor: PropertyDescriptor = {
      get: () => 'test',
      enumerable: true,
      configurable: true,
    }
    expect(isAccessorDescriptor(descriptor)).toBe(true)
  })

  it('should return true for descriptor with setter only', () => {
    const descriptor: PropertyDescriptor = {
      set: () => {},
      enumerable: true,
      configurable: true,
    }
    expect(isAccessorDescriptor(descriptor)).toBe(true)
  })

  it('should return true for descriptor with both getter and setter', () => {
    const descriptor: PropertyDescriptor = {
      get: () => 'test',
      set: () => {},
      enumerable: true,
      configurable: true,
    }
    expect(isAccessorDescriptor(descriptor)).toBe(true)
  })
})
