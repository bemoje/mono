import * as fnLib from '@mono/fn'

import { FunctionProfiler } from './FunctionProfiler'
import { ModuleMethodIdentifier } from '../FunctionIdentifier/ModuleMethodIdentifier'
import { afterEach } from 'vitest'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { profilerWrap } from './profilerWrap'
import { vitest } from 'vitest'

describe('profilerWrap', () => {
  const functionSpyMock = vitest.spyOn(fnLib, 'functionSpy').mockImplementation(((arg: unknown) => {
    return arg
  }) as typeof fnLib.functionSpy)

  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    FunctionProfiler.instances = []
  })

  it('method', () => {
    const fn = vitest.fn(() => {})
    const mod = Object.defineProperty({}, 'fn', { value: fn })
    const id = new ModuleMethodIdentifier('mod', mod, 'fn', 'method')
    const profiler = new FunctionProfiler(id)
    const wrappedFunc = profilerWrap(fn, profiler)
    expect(wrappedFunc).toBeInstanceOf(Function)
    expect(functionSpyMock).toHaveBeenCalledWith(fn, profiler, { ignore: expect.any(Function) })
  })

  it('get', () => {
    const fn = vitest.fn(() => {})
    const mod = Object.defineProperty({}, 'fn', { get: fn })
    const id = new ModuleMethodIdentifier('mod', mod, 'fn', 'get')
    const profiler = new FunctionProfiler(id)
    const wrappedFunc = profilerWrap(fn, profiler)
    expect(wrappedFunc).toBeInstanceOf(Function)
    expect(functionSpyMock).toHaveBeenCalledWith(fn, profiler, { ignore: expect.any(Function), async: false })
  })

  it('set', () => {
    const fn = vitest.fn(() => {})
    const mod = Object.defineProperty({}, 'fn', { set: fn })
    const id = new ModuleMethodIdentifier('mod', mod, 'fn', 'set')
    const profiler = new FunctionProfiler(id)
    const wrappedFunc = profilerWrap(fn, profiler)
    expect(wrappedFunc).toBeInstanceOf(Function)
    expect(functionSpyMock).toHaveBeenCalledWith(fn, profiler, { ignore: expect.any(Function), async: false })
  })
})
