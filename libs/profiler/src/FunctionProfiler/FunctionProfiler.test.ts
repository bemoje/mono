import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import { FunctionProfiler } from './FunctionProfiler'
import { inspect } from 'util'
import { StandaloneFunctionIdentifier } from '../FunctionIdentifier/StandaloneFunctionIdentifier'

describe(FunctionProfiler.name, () => {
  let fn = vitest.fn(() => {})
  let id = new StandaloneFunctionIdentifier(fn)
  let profiler = new FunctionProfiler(id)

  beforeEach(() => {
    fn = vitest.fn(() => {})
    id = new StandaloneFunctionIdentifier(fn)
    profiler = new FunctionProfiler(id)
    vitest.clearAllMocks()
  })

  afterEach(() => {
    FunctionProfiler.instances = []
  })

  it('should create a new instance of FunctionProfiler for a standalone function', () => {
    expect(profiler instanceof FunctionProfiler).toBe(true)
    expect(FunctionProfiler.instances).toContain(profiler)
  })

  it('should initialize with default values', () => {
    expect(profiler.calls).toBe(0)
    expect(profiler.totalTimeNs).toBeUndefined()
    expect(profiler.minTimeNs).toBeUndefined()
    expect(profiler.maxTimeNs).toBeUndefined()
  })

  it('should increment calls', () => {
    profiler.onReturn(profiler.onInvoke(), undefined)
    expect(profiler.calls).toBe(1)
  })

  it('should update totalTimeNs', () => {
    profiler.onReturn(profiler.onInvoke(), undefined)
    expect(profiler.totalTimeNs).toBeDefined()
    expect(profiler.totalTimeNs! > 0).toBe(true)
  })

  it('should update minTimeNs', () => {
    profiler.onReturn(profiler.onInvoke(), undefined)
    expect(profiler.minTimeNs).toBeDefined()
    expect(profiler.minTimeNs! > 0).toBe(true)
  })

  it('should update maxTimeNs', () => {
    profiler.onReturn(profiler.onInvoke(), undefined)
    expect(profiler.maxTimeNs).toBeDefined()
    expect(profiler.maxTimeNs! > 0).toBe(true)
  })

  it('should get valid result', () => {
    profiler.onReturn(profiler.onInvoke(), undefined)
    const result = profiler.getResult()
    expect(result.calls).toBe(1)
    expect(result.totalTimeUs! > 0).toBe(true)
    expect(result.avgTimeUs! > 0).toBe(true)
    expect(result.minTimeUs! > 0).toBe(true)
    expect(result.maxTimeUs! > 0).toBe(true)
  })

  it('[inspect.custom]()', () => {
    const actual = (profiler[inspect.custom] as typeof Function.prototype)()
    expect(actual).toEqual(profiler.getResult())
  })

  it('toJSON()', () => {
    expect(profiler.toJSON()).toEqual(profiler.getResult())
  })
})
