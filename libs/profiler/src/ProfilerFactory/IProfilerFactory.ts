import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { MethodType } from '../FunctionIdentifier/types'

export interface IProfilerFactory<T extends object> {
  createProfiler(key: string | symbol, methodType: MethodType): FunctionProfiler<T>
}
