import { describe, expect, it } from 'vitest'
import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { ModuleMethodIdentifier } from '../FunctionIdentifier/ModuleMethodIdentifier'
import { ModuleMethodProfilerFactory } from './ModuleMethodProfilerFactory'

describe(ModuleMethodProfilerFactory.name, () => {
  const moduleName = 'testModule'
  const target = {}
  const key = 'testKey'

  describe('constructor', () => {
    it('should set the moduleName and target', () => {
      const factory = new ModuleMethodProfilerFactory(moduleName, target)
      expect(factory.moduleName).toBe(moduleName)
      expect(factory.target).toBe(target)
    })
  })
  describe('createProfiler', () => {
    it('should create a profiler with the correct identifier', () => {
      const factory = new ModuleMethodProfilerFactory(moduleName, target)
      const profiler = factory.createProfiler(key, 'method')
      expect(profiler).toBeInstanceOf(FunctionProfiler)
      expect(profiler.id).toBeInstanceOf(ModuleMethodIdentifier)
    })
  })
})
