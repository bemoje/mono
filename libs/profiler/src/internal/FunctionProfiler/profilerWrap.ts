import { FunctionProfiler } from './FunctionProfiler'
import { Profiler } from '../../Profiler/Profiler'
import type { TFunction } from '@mono/types'
import { functionSpy } from '@mono/fn'

/**
 * Wraps a function with a @see FunctionProfiler.
 */
export function profilerWrap<T extends object>(func: TFunction, profiler: FunctionProfiler<T>) {
  const ignore = () => {
    return !Profiler.enabled
  }
  return profiler.id.type === 'get' || profiler.id.type === 'set'
    ? functionSpy(func, profiler, { ignore, async: false })
    : functionSpy(func, profiler, { ignore })
}
