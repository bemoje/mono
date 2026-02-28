import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { ModuleMethodIdentifier } from './ModuleMethodIdentifier'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { inspect } from 'util'
import { it } from 'vitest'

describe(ModuleMethodIdentifier.name, () => {
  const SYMBOL = Symbol('testSymbol')

  const Mod = {
    fn() {},
    _value: 0,
    get value() {
      return this._value
    },
    set value(value) {
      this._value = value
    },
    [SYMBOL]() {},
  }

  const id = new ModuleMethodIdentifier('Mod', Mod, 'fn')

  describe('constructor', () => {
    it('instanceof AbstractFunctionIdentifier', () => {
      return expect(id instanceof AbstractFunctionIdentifier).toBe(true)
    })
    it('instanceof AbstractMethodIdentifier', () => {
      return expect(id instanceof AbstractMethodIdentifier).toBe(true)
    })
    it('instanceof ModuleMethodIdentifier', () => {
      return expect(id instanceof ModuleMethodIdentifier).toBe(true)
    })
    it('target', () => {
      return expect(id.target).toBe(Mod)
    })
  })

  it('targetType', () => {
    return expect(id.targetType).toBe('module')
  })
  it('type', () => {
    return expect(id.type).toBe('method')
  })
  it('parentName', () => {
    return expect(id.parentName).toBe('Mod')
  })
  it('toJSON()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })
  it('[inspect.custom]()', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })

  describe('keyToString()', () => {
    const symbolId = new ModuleMethodIdentifier('Mod', Mod, SYMBOL)
    it('string key ', () => {
      return expect(id.keytoString()).toBe('fn')
    })
    it('symbol key', () => {
      return expect(symbolId.keytoString()).toBe('[testSymbol]')
    })
  })

  describe('name', () => {
    const symbolId = new ModuleMethodIdentifier('Mod', Mod, SYMBOL)
    const getterId = new ModuleMethodIdentifier('Mod', Mod, 'value', 'get')
    const setterId = new ModuleMethodIdentifier('Mod', Mod, 'value', 'set')
    it('method', () => {
      return expect(id.name).toBe('Mod.fn()')
    })
    it('get', () => {
      return expect(getterId.name).toBe('Mod.value')
    })
    it('set', () => {
      return expect(setterId.name).toBe('Mod.value[set]')
    })
    it('symbol key', () => {
      return expect(symbolId.name).toBe('Mod[testSymbol]()')
    })
  })
})
