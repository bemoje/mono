import memoizee from 'memoizee'

export interface MemoizeExtendedOptions {
  /**
   * Whether to share the cache between instances of the class.
   * If true, one instance can cause other instances to return the same memoized value.
   */
  instancesShareCache?: boolean
}

export type SomeSyncFunction = (...args: any[]) => unknown
export type SomeAsyncFunction = (...args: any[]) => Promise<unknown>

export type MemoizeSyncOptions = Omit<memoizee.Options<SomeSyncFunction>, 'async' | 'promise'> &
  MemoizeExtendedOptions

export type MemoizeAsyncOptions = Omit<memoizee.Options<SomeAsyncFunction>, 'async' | 'promise'> &
  MemoizeExtendedOptions
