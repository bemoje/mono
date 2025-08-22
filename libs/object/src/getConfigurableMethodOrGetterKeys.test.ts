import { describe, expect, it } from 'vitest'

import { getConfigurableMethodOrGetterKeys } from './getConfigurableMethodOrGetterKeys'

describe(getConfigurableMethodOrGetterKeys.name, () => {
  it('should return an empty array for an empty object', () => {
    const obj = {}
    const result = getConfigurableMethodOrGetterKeys(obj)
    expect(result).toEqual([])
  })

  it('should return an empty array for an object with no configurable methods or getters', () => {
    const obj = {
      prop1: 'value1',
      prop2: 'value2',
    }
    const result = getConfigurableMethodOrGetterKeys(obj)
    expect(result).toEqual([])
  })

  it('should return an array of keys for an object with configurable methods and getters', () => {
    const obj = {
      method1: () => {},
      method2: () => {},
      get getter1() {
        return 'value1'
      },
      get getter2() {
        return 'value2'
      },
      prop1: 'value1',
    }
    const result = getConfigurableMethodOrGetterKeys(obj)
    expect(result).toEqual(['method1', 'method2', 'getter1', 'getter2'])
  })

  it('should not include non-string keys', () => {
    const obj = {
      1: 'value1',
      [Symbol('symbol')]: 'value2',
      method: () => {},
      get getter() {
        return 'value3'
      },
    }
    const result = getConfigurableMethodOrGetterKeys(obj)
    expect(result).toEqual(['method', 'getter'])
  })

  it('should not include non-configurable methods or getters', () => {
    const obj = {
      method1: () => {},
      method2: () => {},
      get getter1() {
        return 'value1'
      },
      get getter2() {
        return 'value2'
      },
      prop1: 'value1',
    }
    Object.defineProperty(obj, 'method1', { configurable: false })
    Object.defineProperty(obj, 'getter1', { configurable: false })
    const result = getConfigurableMethodOrGetterKeys(obj)
    expect(result).toEqual(['method2', 'getter2'])
  })
})
