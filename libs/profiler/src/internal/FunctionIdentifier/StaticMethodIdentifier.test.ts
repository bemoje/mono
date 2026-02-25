import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { StaticMethodIdentifier } from './StaticMethodIdentifier'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { inspect } from 'node:util'
import { it } from 'vitest'

describe(StaticMethodIdentifier.name, () => {
  const SYMBOL = Symbol('testSymbol')

  class Cls {
    static fn() {}
    static _value = 0
    static get value() {
      return this._value
    }
    static set value(value) {
      this._value = value
    }
    static [SYMBOL]() {}
  }

  const id = new StaticMethodIdentifier(Cls, 'fn')

  describe('constructor', () => {
    it('instanceof AbstractFunctionIdentifier', () => {
      return expect(id instanceof AbstractFunctionIdentifier).toBe(true)
    })
    it('instanceof AbstractMethodIdentifier', () => {
      return expect(id instanceof AbstractMethodIdentifier).toBe(true)
    })
    it('instanceof StaticMethodIdentifier', () => {
      return expect(id instanceof StaticMethodIdentifier).toBe(true)
    })
    it('target', () => {
      return expect(id.target).toBe(Cls)
    })
  })

  it('targetType', () => {
    return expect(id.targetType).toBe('static')
  })
  it('type', () => {
    return expect(id.type).toBe('method')
  })
  it('parentName', () => {
    return expect(id.parentName).toBe(Cls.name)
  })
  it('toJSON()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })
  it('[inspect.custom]()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })

  describe('keyToString()', () => {
    const symbolId = new StaticMethodIdentifier(Cls, SYMBOL)
    it('string key ', () => {
      return expect(id.keytoString()).toBe('fn')
    })
    it('symbol key', () => {
      return expect(symbolId.keytoString()).toBe('[testSymbol]')
    })
  })

  describe('name', () => {
    const symbolId = new StaticMethodIdentifier(Cls, SYMBOL)
    const getterId = new StaticMethodIdentifier(Cls, 'value', 'get')
    const setterId = new StaticMethodIdentifier(Cls, 'value', 'set')
    it('method', () => {
      return expect(id.name).toBe('Cls.fn()')
    })
    it('get', () => {
      return expect(getterId.name).toBe('Cls.value')
    })
    it('set', () => {
      return expect(setterId.name).toBe('Cls.value[set]')
    })
    it('symbol key', () => {
      return expect(symbolId.name).toBe('Cls[testSymbol]()')
    })
  })
})
