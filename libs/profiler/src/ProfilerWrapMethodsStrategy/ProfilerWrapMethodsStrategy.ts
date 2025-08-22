import type { AnyGetter } from '@mono/types'
import type { AnyFunction } from '@mono/types'
import type { AnySetter } from '@mono/types'
import type { TFunction } from '@mono/types'
import type { IProfilerFactory } from '../ProfilerFactory/IProfilerFactory'
import { profilerWrap } from '../FunctionProfiler/profilerWrap'
import type { WrapMethodsStrategy } from '@mono/fn'

/**
 * Strategy for wrapping object methods with profiling capabilities using the Strategy pattern.
 */
export class ProfilerWrapMethodsStrategy<Target extends object> implements WrapMethodsStrategy<Target> {
  readonly profilerFactory: IProfilerFactory<Target>
  readonly ignoreKeys: Set<string | symbol>

  constructor(profilerFactory: IProfilerFactory<Target>, ignoreKeys?: Iterable<string | symbol>) {
    this.profilerFactory = profilerFactory
    this.ignoreKeys = new Set(ignoreKeys)
  }

  filter<T extends Target>(target: T, key: string | symbol): boolean {
    if (key === 'constructor') return false
    if (this.ignoreKeys.has(key)) return false
    return true
  }

  onMethod<T extends Target>(target: T, key: string | symbol, method: AnyFunction) {
    return profilerWrap(method as TFunction, this.profilerFactory.createProfiler(key, 'method'))
  }

  onGetter<T extends Target>(target: T, key: string | symbol, getter: AnyGetter) {
    return profilerWrap(getter, this.profilerFactory.createProfiler(key, 'get')) as AnyGetter
  }

  onSetter<T extends Target>(target: T, key: string | symbol, setter: AnySetter) {
    return profilerWrap(setter, this.profilerFactory.createProfiler(key, 'set')) as AnySetter
  }
}
