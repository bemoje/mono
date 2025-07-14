import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import type { FunctionPrototype } from '@mono/types'
import type { IProfilerFactory } from './IProfilerFactory'
import type { MethodType } from '../FunctionIdentifier/types'
import { StaticMethodIdentifier } from '../FunctionIdentifier/StaticMethodIdentifier'

/**
 * Factory for creating profilers for static method functions using the Factory pattern.
 */
export class StaticMethodProfilerFactory implements IProfilerFactory<FunctionPrototype> {
  constructor(readonly target: FunctionPrototype) {}

  createProfiler(key: string | symbol, methodType: MethodType): FunctionProfiler<FunctionPrototype> {
    return new FunctionProfiler(new StaticMethodIdentifier(this.target, key, methodType))
  }
}
