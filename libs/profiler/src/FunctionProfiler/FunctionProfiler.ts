import { AbstractFunctionIdentifier } from '../FunctionIdentifier/AbstractFunctionIdentifier'
import type { IFunctionSpyStrategy } from '@mono/fn'
import { inspect } from 'util'

/**
 * Profiler for functions, measuring execution time and call counts.
 */
export class FunctionProfiler<T extends object> implements IFunctionSpyStrategy<T, bigint> {
  static instances: FunctionProfiler<object>[] = []
  calls = 0
  totalTimeNs?: number
  minTimeNs?: number
  maxTimeNs?: number

  constructor(readonly id: AbstractFunctionIdentifier<T>) {
    FunctionProfiler.instances.push(this)
  }

  /**
   * Average execution time in nanoseconds
   */
  get avgTimeNs(): number | undefined {
    if (!this.calls || !this.totalTimeNs) return undefined
    return Math.floor(this.totalTimeNs / this.calls)
  }

  /**
   * Get the result of the profiling
   */
  getResult(): IFunctionProfilerResult {
    return {
      calls: this.calls,
      totalTimeUs: this.totalTimeNs ? this.nsToUs(this.totalTimeNs) : undefined,
      avgTimeUs: this.avgTimeNs ? this.nsToUs(this.avgTimeNs) : undefined,
      minTimeUs: this.minTimeNs == null ? this.minTimeNs : this.nsToUs(this.minTimeNs),
      maxTimeUs: this.maxTimeNs == null ? this.maxTimeNs : this.nsToUs(this.maxTimeNs),
    }
  }

  /**
   * @see IFunctionSpyStrategy.onInvoke
   */
  onInvoke(): bigint {
    return process.hrtime.bigint()
  }

  /**
   * @see IFunctionSpyStrategy.onReturn
   */
  onReturn<Ret>(t0: bigint, retval: Ret): Ret {
    this.add(t0, process.hrtime.bigint())
    return retval
  }

  /**
   * Add a new time measurement
   */
  protected add(t0: bigint, t1: bigint) {
    const elapsed = Number(t1 - t0)
    this.calls++
    this.totalTimeNs = (this.totalTimeNs ?? 0) + elapsed
    this.minTimeNs = Math.min(this.minTimeNs ?? elapsed, elapsed)
    this.maxTimeNs = Math.max(this.maxTimeNs ?? elapsed, elapsed)
  }

  /**
   * Nanoseconds to microseconds
   */
  protected nsToUs(ns: number): number {
    return Math.round(ns / 1000)
  }

  public [inspect.custom]() {
    return this.getResult()
  }

  toJSON() {
    return this.getResult()
  }
}

export interface IFunctionProfilerResult {
  /**
   * Number of method calls
   */
  calls: number

  /**
   * Total execution time in microseconds
   */
  totalTimeUs?: number

  /**
   * Total execution time in microseconds
   */
  avgTimeUs?: number

  /**
   * Fastest execution time in microseconds
   */
  minTimeUs?: number

  /**
   * Slowest execution time in microseconds
   */
  maxTimeUs?: number
}
