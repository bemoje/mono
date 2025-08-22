import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { IProfilerFactory } from '../ProfilerFactory/IProfilerFactory'
import { ProfilerWrapMethodsStrategy } from './ProfilerWrapMethodsStrategy'

describe(ProfilerWrapMethodsStrategy.name, () => {
  class MockProfilerFactory implements IProfilerFactory<object> {
    createProfiler(_key: string | symbol, _type: string) {
      return vitest.fn() as unknown as FunctionProfiler<object>
    }
  }

  beforeEach(() => {
    vitest.clearAllMocks()
  })

  describe('constructor', () => {
    it('ignoreKeys', () => {
      const profilerFactory = new MockProfilerFactory()
      const ignoreKeys = ['key1', 'key2']
      const strategy = new ProfilerWrapMethodsStrategy(profilerFactory, ignoreKeys)
      const target = {}
      expect(strategy.filter(target, 'constructor')).toBe(false)
      expect(strategy.filter(target, 'key1')).toBe(false)
      expect(strategy.filter(target, 'key2')).toBe(false)
      expect(strategy.filter(target, 'key3')).toBe(true)
    })
  })
})
