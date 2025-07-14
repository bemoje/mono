import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { IProfilerFactory } from './IProfilerFactory'
import { MethodType } from '../FunctionIdentifier/types'
import { ModuleMethodIdentifier } from '../FunctionIdentifier/ModuleMethodIdentifier'

/**
 * Factory for creating profilers for module method functions using the Factory pattern.
 */
export class ModuleMethodProfilerFactory implements IProfilerFactory<object> {
  constructor(
    readonly moduleName: string,
    readonly target: object,
  ) {}

  createProfiler(key: string | symbol, methodType: MethodType): FunctionProfiler<object> {
    return new FunctionProfiler(new ModuleMethodIdentifier(this.moduleName, this.target, key, methodType))
  }
}
