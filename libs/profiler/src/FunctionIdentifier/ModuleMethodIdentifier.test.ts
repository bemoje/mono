import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { describe, expect, it } from 'vitest'
import { inspect } from 'util'
import { ModuleMethodIdentifier } from './ModuleMethodIdentifier'

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
    it('instanceof AbstractFunctionIdentifier', () => expect(id instanceof AbstractFunctionIdentifier).toBe(true))
    it('instanceof AbstractMethodIdentifier', () => expect(id instanceof AbstractMethodIdentifier).toBe(true))
    it('instanceof ModuleMethodIdentifier', () => expect(id instanceof ModuleMethodIdentifier).toBe(true))
    it('target', () => expect(id.target).toBe(Mod))
  })

  it('targetType', () => expect(id.targetType).toBe('module'))
  it('type', () => expect(id.type).toBe('method'))
  it('parentName', () => expect(id.parentName).toBe('Mod'))
  it('toJSON()', () => expect(id[inspect.custom]()).toBe(id.name))
  it('[inspect.custom]()', () => expect(id[inspect.custom]()).toBe(id.name))

  describe('keyToString()', () => {
    const symbolId = new ModuleMethodIdentifier('Mod', Mod, SYMBOL)
    it('string key ', () => expect(id.keytoString()).toBe('fn'))
    it('symbol key', () => expect(symbolId.keytoString()).toBe('[testSymbol]'))
  })

  describe('name', () => {
    const symbolId = new ModuleMethodIdentifier('Mod', Mod, SYMBOL)
    const getterId = new ModuleMethodIdentifier('Mod', Mod, 'value', 'get')
    const setterId = new ModuleMethodIdentifier('Mod', Mod, 'value', 'set')
    it('method', () => expect(id.name).toBe('Mod.fn()'))
    it('get', () => expect(getterId.name).toBe('Mod.value'))
    it('set', () => expect(setterId.name).toBe('Mod.value[set]'))
    it('symbol key', () => expect(symbolId.name).toBe('Mod[testSymbol]()'))
  })
})
