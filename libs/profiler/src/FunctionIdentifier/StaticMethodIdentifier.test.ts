import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { describe, expect, it } from 'vitest'
import { inspect } from 'util'
import { StaticMethodIdentifier } from './StaticMethodIdentifier'

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
    it('instanceof AbstractFunctionIdentifier', () => expect(id instanceof AbstractFunctionIdentifier).toBe(true))
    it('instanceof AbstractMethodIdentifier', () => expect(id instanceof AbstractMethodIdentifier).toBe(true))
    it('instanceof StaticMethodIdentifier', () => expect(id instanceof StaticMethodIdentifier).toBe(true))
    it('target', () => expect(id.target).toBe(Cls))
  })

  it('targetType', () => expect(id.targetType).toBe('static'))
  it('type', () => expect(id.type).toBe('method'))
  it('parentName', () => expect(id.parentName).toBe(Cls.name))
  it('toJSON()', () => expect(id[inspect.custom]()).toBe(id.name))
  it('[inspect.custom]()', () => expect(id[inspect.custom]()).toBe(id.name))

  describe('keyToString()', () => {
    const symbolId = new StaticMethodIdentifier(Cls, SYMBOL)
    it('string key ', () => expect(id.keytoString()).toBe('fn'))
    it('symbol key', () => expect(symbolId.keytoString()).toBe('[testSymbol]'))
  })

  describe('name', () => {
    const symbolId = new StaticMethodIdentifier(Cls, SYMBOL)
    const getterId = new StaticMethodIdentifier(Cls, 'value', 'get')
    const setterId = new StaticMethodIdentifier(Cls, 'value', 'set')
    it('method', () => expect(id.name).toBe('Cls.fn()'))
    it('get', () => expect(getterId.name).toBe('Cls.value'))
    it('set', () => expect(setterId.name).toBe('Cls.value[set]'))
    it('symbol key', () => expect(symbolId.name).toBe('Cls[testSymbol]()'))
  })
})
