import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { PrototypeMethodIdentifier } from './PrototypeMethodIdentifier'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { inspect } from 'util'
import { it } from 'vitest'

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
    it('instanceof AbstractFunctionIdentifier', () => {
      return expect(id instanceof AbstractFunctionIdentifier).toBe(true)
    })
    it('instanceof AbstractMethodIdentifier', () => {
      return expect(id instanceof AbstractMethodIdentifier).toBe(true)
    })
    it('instanceof PrototypeMethodIdentifier', () => {
      return expect(id instanceof PrototypeMethodIdentifier).toBe(true)
    })
    it('target', () => {
      return expect(id.target).toBe(Cls.prototype)
    })
  })

  it('targetType', () => {
    return expect(id.targetType).toBe('prototype')
  })
  it('type', () => {
    return expect(id.type).toBe('method')
  })
  it('parentName', () => {
    return expect(id.parentName).toBe('Cls.prototype')
  })
  it('toJSON()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })
  it('[inspect.custom]()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })

  describe('keyToString()', () => {
    const symbolId = new PrototypeMethodIdentifier(Cls.prototype, SYMBOL)
    it('string key ', () => {
      return expect(id.keytoString()).toBe('fn')
    })
    it('symbol key', () => {
      return expect(symbolId.keytoString()).toBe('[testSymbol]')
    })
  })

  describe('name', () => {
    const symbolId = new PrototypeMethodIdentifier(Cls.prototype, SYMBOL)
    const getterId = new PrototypeMethodIdentifier(Cls.prototype, 'value', 'get')
    const setterId = new PrototypeMethodIdentifier(Cls.prototype, 'value', 'set')
    it('method', () => {
      return expect(id.name).toBe('Cls.prototype.fn()')
    })
    it('get', () => {
      return expect(getterId.name).toBe('Cls.prototype.value')
    })
    it('set', () => {
      return expect(setterId.name).toBe('Cls.prototype.value[set]')
    })
    it('symbol key', () => {
      return expect(symbolId.name).toBe('Cls.prototype[testSymbol]()')
    })
  })
})
