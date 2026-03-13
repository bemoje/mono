import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import { StandaloneFunctionIdentifier } from './StandaloneFunctionIdentifier'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { inspect } from 'util'
import { it } from 'vitest'

describe(StandaloneFunctionIdentifier.name, () => {
  function fn() {}
  const id = new StandaloneFunctionIdentifier(fn)
  describe('constructor', () => {
    it('instanceof AbstractFunctionIdentifier', () => {
      return expect(id instanceof AbstractFunctionIdentifier).toBe(true)
    })
    it('instanceof StandaloneFunctionIdentifier', () => {
      return expect(id instanceof StandaloneFunctionIdentifier).toBe(true)
    })
    it('target', () => {
      return expect(id.target).toBe(fn)
    })
  })
  it('targetType', () => {
    return expect(id.targetType).toBe('standalone')
  })
  it('type', () => {
    return expect(id.type).toBe('function')
  })
  it('name', () => {
    return expect(id.name).toBe('fn()')
  })
  it('toJSON', () => {
    return expect(id.toJSON()).toBe(id.name)
  })
  it('[inspect.custom]', () => {
    return expect(id[inspect.custom]()).toBe(id.name)
  })
})
