import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { describe, expect, it } from 'vitest'
import { inspect } from 'util'
import { PrototypeMethodIdentifier } from './PrototypeMethodIdentifier'

describe(PrototypeMethodIdentifier.name, () => {
  const SYMBOL = Symbol('testSymbol')

  class Cls {
    fn() {}
    _value = 0
    get value() {
      return this._value
    }
    set value(value) {
      this._value = value
    }
    public [SYMBOL]() {}
  }

  const id = new PrototypeMethodIdentifier(Cls.prototype, 'fn')

  describe('constructor', () => {
    it('instanceof AbstractFunctionIdentifier', () => expect(id instanceof AbstractFunctionIdentifier).toBe(true))
    it('instanceof AbstractMethodIdentifier', () => expect(id instanceof AbstractMethodIdentifier).toBe(true))
    it('instanceof PrototypeMethodIdentifier', () => expect(id instanceof PrototypeMethodIdentifier).toBe(true))
    it('target', () => expect(id.target).toBe(Cls.prototype))
  })

  it('targetType', () => expect(id.targetType).toBe('prototype'))
  it('type', () => expect(id.type).toBe('method'))
  it('parentName', () => expect(id.parentName).toBe('Cls.prototype'))
  it('toJSON()', () => expect(id[inspect.custom]()).toBe(id.name))
  it('[inspect.custom]()', () => expect(id[inspect.custom]()).toBe(id.name))

  describe('keyToString()', () => {
    const symbolId = new PrototypeMethodIdentifier(Cls.prototype, SYMBOL)
    it('string key ', () => expect(id.keytoString()).toBe('fn'))
    it('symbol key', () => expect(symbolId.keytoString()).toBe('[testSymbol]'))
  })

  describe('name', () => {
    const symbolId = new PrototypeMethodIdentifier(Cls.prototype, SYMBOL)
    const getterId = new PrototypeMethodIdentifier(Cls.prototype, 'value', 'get')
    const setterId = new PrototypeMethodIdentifier(Cls.prototype, 'value', 'set')
    it('method', () => expect(id.name).toBe('Cls.prototype.fn()'))
    it('get', () => expect(getterId.name).toBe('Cls.prototype.value'))
    it('set', () => expect(setterId.name).toBe('Cls.prototype.value[set]'))
    it('symbol key', () => expect(symbolId.name).toBe('Cls.prototype[testSymbol]()'))
  })
})
