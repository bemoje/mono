import { describe, expect, it } from 'vitest'

import { objPropertyValueToGetter } from './objPropertyValueToGetter'

describe('objPropertyValueToGetter', () => {
  it('should throw an error if the property does not exist on the object', () => {
    const obj = {}
    expect(() => objPropertyValueToGetter(obj, 'prop')).toThrow()
  })

  it('should set the property as a getter', () => {
    const obj = { prop: 'value' }
    objPropertyValueToGetter(obj, 'prop')
    expect(obj.prop).toBe('value')
  })

  it('should set multiple properties as getters', () => {
    const obj = { prop1: 'value1', prop2: 'value2' }
    objPropertyValueToGetter(obj, 'prop1', 'prop2')
    expect(obj.prop1).toBe('value1')
    expect(obj.prop2).toBe('value2')
  })

  it('should convert specified properties into getter functions', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = objPropertyValueToGetter(obj, 'a', 'b')
    expect(typeof result.a).toBe('number')
    expect(typeof result.b).toBe('number')
    expect(result.a).toBe(1)
    expect(result.b).toBe(2)
  })

  it('should not affect properties not specified', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = objPropertyValueToGetter(obj, 'a', 'b')
    expect(typeof result.c).toBe('number')
    expect(result.c).toBe(3)
  })

  it('should throw an error if property descriptor is not found', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(() => objPropertyValueToGetter(obj, 'd')).toThrowError("Property descriptor for 'd' not found.")
  })

  it('should handle symbol properties', () => {
    const sym = Symbol('sym')
    const obj = { [sym]: 'value' }
    const result = objPropertyValueToGetter(obj, sym)
    expect(typeof result[sym]).toBe('string')
    expect(result[sym]).toBe('value')
  })

  it('should handle number properties', () => {
    const obj = { 1: 'one', 2: 'two' }
    const result = objPropertyValueToGetter(obj, 1, 2)
    expect(typeof result[1]).toBe('string')
    expect(result[1]).toBe('one')
    expect(typeof result[2]).toBe('string')
    expect(result[2]).toBe('two')
  })
})
