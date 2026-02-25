import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { StaticMethodIdentifier } from '../FunctionIdentifier/StaticMethodIdentifier'
import { StaticMethodProfilerFactory } from './StaticMethodProfilerFactory'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(StaticMethodProfilerFactory.name, () => {
  const target = class Target {}
  const key = 'testKey'

  describe('constructor', () => {
    it('should set the target', () => {
      const factory = new StaticMethodProfilerFactory(target)
      expect(factory.target).toBe(target)
    })
  })
  describe('createProfiler', () => {
    it('should create a profiler with the correct identifier', () => {
      const factory = new StaticMethodProfilerFactory(target)
      const profiler = factory.createProfiler(key, 'method')
      expect(profiler).toBeInstanceOf(FunctionProfiler)
      expect(profiler.id).toBeInstanceOf(StaticMethodIdentifier)
    })
  })
})
