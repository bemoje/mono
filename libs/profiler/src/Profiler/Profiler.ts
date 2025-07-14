import type { TFunction } from '@mono/types'
import { FunctionProfiler, IFunctionProfilerResult } from '../FunctionProfiler/FunctionProfiler'
import type { FunctionPrototype } from '@mono/types'
import { inspect, InspectOptions } from 'util'
import { isFunction } from 'lodash-es'
import { ModuleMethodProfilerFactory } from '../ProfilerFactory/ModuleMethodProfilerFactory'
import { profilerWrap } from '../FunctionProfiler/profilerWrap'
import { ProfilerWrapMethodsStrategy } from '../ProfilerWrapMethodsStrategy/ProfilerWrapMethodsStrategy'
import { PrototypeMethodProfilerFactory } from '../ProfilerFactory/PrototypeMethodProfilerFactory'
import { setName } from '@mono/fn'
import { StandaloneFunctionIdentifier } from '../FunctionIdentifier/StandaloneFunctionIdentifier'
import { StaticMethodProfilerFactory } from '../ProfilerFactory/StaticMethodProfilerFactory'
import { TableFormatter } from '@mono/table'
import { wrapMethods } from '@mono/fn'

/** TJE PRO */
export class Profiler {
  static enabled: boolean = true

  static get data() {
    return FunctionProfiler.instances.slice()
  }

  /**
   * Class profiling
   */
  static class<T extends FunctionPrototype & { profiler?: ProfilerClassOptions }>(
    target: T,
    options?: ProfilerClassOptions,
  ): T

  /**
   * Class profiling decorator
   */
  static class<T extends FunctionPrototype & { profiler?: ProfilerClassOptions }>(
    options: ProfilerClassOptions,
  ): (target: T) => T

  /**
   *
   */
  static class<T extends FunctionPrototype & { profiler?: ProfilerClassOptions }>(
    targetOrOptions: T | ProfilerClassOptions,
    options?: ProfilerClassOptions,
  ) {
    if (isFunction(targetOrOptions)) {
      const target = targetOrOptions
      Profiler.classStatic(target, options?.ignoreStaticKeys)
      Profiler.classPrototype(target, options?.ignorePrototypeKeys)
      return target
    } else {
      return (target: T) => Profiler.class(target, targetOrOptions as ProfilerClassOptions | undefined)
    }
  }

  static classStatic<T extends FunctionPrototype & { profiler?: ProfilerClassOptions }>(
    target: T,
    ignoreKeys?: Iterable<string | symbol>,
  ) {
    if (Profiler.enabled) {
      wrapMethods(
        target,
        new ProfilerWrapMethodsStrategy(new StaticMethodProfilerFactory(target), [
          ...(ignoreKeys ?? []),
          ...(target.profiler?.ignoreStaticKeys ?? []),
        ]),
      )
    }
    return target
  }

  static classPrototype<T extends FunctionPrototype & { profiler?: ProfilerClassOptions }>(
    target: T,
    ignoreKeys?: Iterable<string | symbol>,
  ) {
    if (Profiler.enabled) {
      wrapMethods(
        target.prototype,
        new ProfilerWrapMethodsStrategy(new PrototypeMethodProfilerFactory(target.prototype), [
          ...(ignoreKeys ?? []),
          ...(target.profiler?.ignorePrototypeKeys ?? []),
        ]),
      )
    }
    return target
  }

  static module<T extends object>(target: T, moduleName: string, ignoreKeys?: Iterable<string | symbol>) {
    if (Profiler.enabled) {
      wrapMethods(
        target,
        new ProfilerWrapMethodsStrategy(new ModuleMethodProfilerFactory(moduleName, target), ignoreKeys),
      )
    }
    return target
  }

  static fn<T extends TFunction>(func: T): T
  static fn<T extends TFunction>(name: string, func: T): T
  static fn<T extends TFunction>(nameOrFunc: T, maybeFunc?: T) {
    const func: T = isFunction(nameOrFunc) ? nameOrFunc : setName(nameOrFunc, maybeFunc as T)
    if (!func.name) throw new Error('Function must have a name:\n' + func.toString())
    if (Profiler.enabled) {
      return profilerWrap(func, new FunctionProfiler(new StandaloneFunctionIdentifier(func)))
    }
    return func
  }

  static getResults(options?: GetProfilerResultsOptions): ProfilerResultReadableEntry[] {
    const results: ProfilerResultReadableEntry[] = Profiler.data.map((profiler) => {
      return [profiler.id.name, profiler.getResult()]
    })

    const sortkey1 = options?.sortBy ?? ('calls' as keyof IFunctionProfilerResult)
    const sortValue1 = (entry: ProfilerResultReadableEntry) => entry[1][sortkey1] ?? -1

    const sortKey2: keyof IFunctionProfilerResult = sortkey1 === 'calls' ? 'totalTimeUs' : 'calls'
    const sortValue2 = (entry: ProfilerResultReadableEntry) => entry[1][sortKey2] ?? -1

    return results.sort((a: ProfilerResultReadableEntry, b: ProfilerResultReadableEntry) => {
      const comparision = sortValue1(a) - sortValue1(b)
      if (comparision !== 0) return comparision
      return sortValue2(a) - sortValue2(b)
    })
  }

  static printResults(options?: PrintProfilerResultsOptions) {
    let entries = this.getResults(options)
    if (options?.update) entries = options.update(entries)

    const headers = ['Execution time (microseconds)', 'calls', 'total', 'avg', 'min', 'max']
    const rows = entries.map(([method, stats]) => {
      return [method, stats.calls, stats.totalTimeUs, stats.avgTimeUs, stats.minTimeUs, stats.maxTimeUs]
    })
    const table = [headers, ...rows] as (string | number)[][]

    const formatter = new TableFormatter(table, {
      color: options?.noColor ? false : true,
      grayOutRow: (row) => row[1] === 0,
    })

    console.log()
    formatter.formattedLines.forEach((line) => console.log(line))
    console.log()
  }

  static [inspect.custom](depth?: number, options: InspectOptions = {}) {
    options.compact = true
    return Object.fromEntries(this.getResults())
  }

  static toJSON() {
    return this.getResults()
  }
}

export default Profiler

export interface ProfilerClassOptions {
  ignoreStaticKeys?: Iterable<string | symbol>
  ignorePrototypeKeys?: Iterable<string | symbol>
}

export interface GetProfilerResultsOptions {
  sortBy?: keyof IFunctionProfilerResult
}

export interface PrintProfilerResultsOptions extends GetProfilerResultsOptions {
  update?: (entries: ProfilerResultReadableEntry[]) => ProfilerResultReadableEntry[]
  noColor?: boolean
}

export type ProfilerResultReadableEntry = [string, IFunctionProfilerResult]
