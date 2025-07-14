import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { IProfilerFactory } from './IProfilerFactory'
import { MethodType } from '../FunctionIdentifier/types'
import { PrototypeMethodIdentifier } from '../FunctionIdentifier/PrototypeMethodIdentifier'

/**
 * Factory for creating profilers for prototype method functions using the Factory pattern.
 */
export class PrototypeMethodProfilerFactory implements IProfilerFactory<object> {
  constructor(readonly target: object) {}

  createProfiler(key: string | symbol, methodType: MethodType): FunctionProfiler<object> {
    return new FunctionProfiler(new PrototypeMethodIdentifier(this.target, key, methodType))
  }
}
