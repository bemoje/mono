import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { describe, expect, it } from 'vitest'
import { inspect } from 'util'
import { StandaloneFunctionIdentifier } from './StandaloneFunctionIdentifier'

describe(StandaloneFunctionIdentifier.name, () => {
  function fn() {}
  const id = new StandaloneFunctionIdentifier(fn)
  describe('constructor', () => {
    it('instanceof AbstractFunctionIdentifier', () => expect(id instanceof AbstractFunctionIdentifier).toBe(true))
    it('instanceof StandaloneFunctionIdentifier', () =>
      expect(id instanceof StandaloneFunctionIdentifier).toBe(true))
    it('target', () => expect(id.target).toBe(fn))
  })
  it('targetType', () => expect(id.targetType).toBe('standalone'))
  it('type', () => expect(id.type).toBe('function'))
  it('name', () => expect(id.name).toBe('fn()'))
  it('toJSON', () => expect(id.toJSON()).toBe(id.name))
  it('[inspect.custom]', () => expect(id[inspect.custom]()).toBe(id.name))
})
