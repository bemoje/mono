import type { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import type { MethodType } from '../FunctionIdentifier/types'

export interface IProfilerFactory<T extends object> {
  createProfiler(key: string | symbol, methodType: MethodType): FunctionProfiler<T>
}
