import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { defineAccessors } from './defineAccessors'

describe(defineAccessors.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = {}
      let value = 0

      defineAccessors(obj, 'prop', {
        get: () => value,
        set: (v) => {
          value = v
        },
      })

      // @ts-expect-error - Property 'prop' does not exist on type '{}'
      obj.prop = 5

      // @ts-expect-error - Property 'prop' does not exist on type '{}'
      expect(obj.prop).toBe(5)
    }).not.toThrow()
  })

  it('should define a getter and setter on an object', () => {
    const obj = {}
    let value = 0

    defineAccessors(obj, 'prop', {
      get: () => value,
      set: (v) => {
        value = v
      },
    })

    // Using any to bypass TypeScript's type checking
    const typedObj = obj as any

    typedObj.prop = 10
    expect(typedObj.prop).toBe(10)
    expect(value).toBe(10)
  })

  it('should create a non-enumerable property by default', () => {
    const obj = {}

    defineAccessors(obj, 'prop', {
      get: () => 42,
    })

    const descriptors = Object.getOwnPropertyDescriptors(obj)
    expect(descriptors.prop.enumerable).toBe(false)
  })

  it('should create a configurable property by default', () => {
    const obj = {}

    defineAccessors(obj, 'prop', {
      get: () => 42,
    })

    const descriptors = Object.getOwnPropertyDescriptors(obj)
    expect(descriptors.prop.configurable).toBe(true)
  })

  it('should override default descriptor values when specified', () => {
    const obj = {}

    defineAccessors(obj, 'prop', {
      get: () => 42,
      enumerable: true,
    })

    const descriptors = Object.getOwnPropertyDescriptors(obj)
    expect(descriptors.prop.enumerable).toBe(true)
    expect(descriptors.prop.configurable).toBe(true)
  })

  it('should work with symbol keys', () => {
    const obj = {}
    const symbolKey = Symbol('test')
    let value = 'symbol value'

    defineAccessors(obj, symbolKey, {
      get: () => value,
      set: (v) => {
        value = v
      },
    })

    const objWithSymbol = obj as any

    expect(objWithSymbol[symbolKey]).toBe('symbol value')
    objWithSymbol[symbolKey] = 'new value'
    expect(value).toBe('new value')
  })

  it('should return the object for method chaining', () => {
    const obj = {}

    const result = defineAccessors(obj, 'prop', {
      get: () => 42,
    })

    expect(result).toBe(obj)
  })
})
