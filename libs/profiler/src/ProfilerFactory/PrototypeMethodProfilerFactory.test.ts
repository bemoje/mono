import { describe, expect, it } from 'vitest'
import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { PrototypeMethodIdentifier } from '../FunctionIdentifier/PrototypeMethodIdentifier'
import { PrototypeMethodProfilerFactory } from './PrototypeMethodProfilerFactory'

describe(PrototypeMethodProfilerFactory.name, () => {
  const target = class Target {}
  const key = 'testKey'

  describe('constructor', () => {
    it('should set the target', () => {
      const factory = new PrototypeMethodProfilerFactory(target)
      expect(factory.target).toBe(target)
    })
  })
  describe('createProfiler', () => {
    it('should create a profiler with the correct identifier', () => {
      const factory = new PrototypeMethodProfilerFactory(target)
      const profiler = factory.createProfiler(key, 'method')
      expect(profiler).toBeInstanceOf(FunctionProfiler)
      expect(profiler.id).toBeInstanceOf(PrototypeMethodIdentifier)
    })
  })
})
