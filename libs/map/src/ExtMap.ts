import { InspectOptions } from 'node:util'
import { View } from '@mono/composition'
import { defineMethod } from '@mono/object'
import { entriesArray } from './entriesArray'
import { entriesOf } from '@mono/object'
import { filterIterable } from '@mono/iter'
import { inheritProxifiedPrototype } from '@mono/composition'
import { inspect } from 'node:util'
import { isIterable } from 'iter-tools'
import { keysArray } from './keysArray'
import { mapGetOrDefault } from './mapGetOrDefault'
import { mapIterable } from '@mono/iter'
import { mapIterableKeys } from '@mono/iter'
import { mapIterableValues } from '@mono/iter'
import { mapLoad } from './mapLoad'
import { mapReverse } from './mapReverse'
import { mapUpdate } from './mapUpdate'
import { reduceIterable } from '@mono/iter'
import { sort } from './sort'
import { sortByKeys } from './sortByKeys'
import { sortByValues } from './sortByValues'
import { toMap } from './toMap'
import { toObjectIterable } from '@mono/iter'
import { valuesArray } from './valuesArray'

declare module './ExtMap' {
  export interface ExtMap<K, V> extends Map<K, V> {
    load(entries: Iterable<[K, V]>): this
    sort(compare: (a: [K, V], b: [K, V]) => number): this
    sortByKeys(compare: (a: K, b: K) => number): this
    sortByValues(compare: (a: V, b: V) => number): this
    reverse(): this
    update(key: K, update: (value: V | undefined, key: K, map: this) => V): this
    getOrDefault(key: K, factory: (key: K, map: this) => V): V
    keysArray(): K[]
    valuesArray(): V[]
    entriesArray(): [K, V][]
    toMap(): Map<K, V>
    toObject<K extends string, V>(): Record<K, V>
    reduce<R>(reducer: (accumulator: R, value: V, key: K) => R, initialValue: R): R
    map<NewK, NewV>(mapper: (value: V, key: K) => [NewK, NewV]): ExtMap<NewK, NewV>
    mapKeys<NewK>(mapper: (key: K, value: V) => NewK): ExtMap<NewK, V>
    mapValues<NewV>(mapper: (value: V, key: K) => NewV): ExtMap<K, NewV>
    filter(predicate: (value: V, key: K) => boolean): ExtMap<K, V>
  }
}

/**
 * Minimal Extended Map class focused only on Map-specific utilities.
 *
 * @template K - The type of keys in the map
 * @template V - The type of values in the map
 *
 * @example
 * ```typescript
 * import { map as iterMap, filter } from 'iter-tools'
 *
 * const extMap = new ExtMap<string, number>()
 *   .load([['a', 1], ['b', 2], ['c', 3]])
 *   .update('a', v => (v ?? 0) + 10)
 *   .sortByValues((a, b) => a - b)
 *
 * // Use iter-tools for transformations
 * const doubled = new ExtMap<string, number>()
 *   .load(iterMap(([k, v]) => [k, v * 2], extMap))
 *
 * // Use iter-tools for filtering
 * const filtered = new ExtMap<string, number>()
 *   .load(filter(([k, v]) => v > 5, extMap))
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ExtMap<K = any, V = any> extends View<Map<K, V>> implements Map<K, V> {
  constructor(iterable?: Iterable<readonly [K, V]> | null | undefined)
  constructor(obj?: Record<Extract<K, string>, V>)
  constructor(arg?: Record<Extract<K, string>, V> | Iterable<readonly [K, V]> | null | undefined) {
    super(new Map(isIterable(arg) ? arg : arg ? entriesOf(arg) : undefined))
  }

  static fromObject<K extends string, V>(obj: Record<K, V>): ExtMap<K, V> {
    return new ExtMap(entriesOf(obj))
  }

  static fromIterable<K, V>(entries: Iterable<readonly [K, V]>): ExtMap<K, V> {
    return new ExtMap(entries)
  }

  /**
   * Creates a shallow copy of the map.
   *
   * @returns A new ExtMap instance with the same entries
   */
  clone(): ExtMap<K, V> {
    return new ExtMap(this)
  }

  /**
   * Converts the map to a JSON-serializable format.
   *
   * @returns Array of key-value pairs suitable for JSON serialization
   */
  toJSON(): [K, V][] {
    return [...this.entries()]
  }

  /**
   * Custom inspection method for better debugging output.
   *
   * @param _depth - The depth of inspection
   * @param _options - Options for inspection
   * @returns A string representation of the map
   */
  [inspect.custom](_depth: number, _options: InspectOptions): string {
    return inspect(this.target, { breakLength: 50 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function thisify<T, Args extends any[], Ret>(
  fn: (target: T, ...args: Args) => Ret,
): (this: T, ...args: Args) => Ret {
  return function (this: T, ...args: Args): Ret {
    return fn(this, ...args)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformReturnValue<T, Args extends any[], Ret, NewRet>(
  fn: (this: T, ...args: Args) => Ret,
  transform: (value: Ret) => NewRet,
): (this: T, ...args: Args) => NewRet {
  return function (this: T, ...args: Args): NewRet {
    const result = fn.apply(this, args)
    return transform(result)
  }
}

inheritProxifiedPrototype(ExtMap, Map, [])

defineMethod(ExtMap.prototype, 'load', thisify(mapLoad))
defineMethod(ExtMap.prototype, 'sort', thisify(sort))
defineMethod(ExtMap.prototype, 'sortByKeys', thisify(sortByKeys))
defineMethod(ExtMap.prototype, 'sortByValues', thisify(sortByValues))
defineMethod(ExtMap.prototype, 'reverse', thisify(mapReverse))
defineMethod(ExtMap.prototype, 'update', thisify(mapUpdate))
defineMethod(ExtMap.prototype, 'getOrDefault', thisify(mapGetOrDefault))
defineMethod(ExtMap.prototype, 'keysArray', thisify(keysArray))
defineMethod(ExtMap.prototype, 'valuesArray', thisify(valuesArray))
defineMethod(ExtMap.prototype, 'entriesArray', thisify(entriesArray))
defineMethod(ExtMap.prototype, 'toMap', thisify(toMap))
defineMethod(ExtMap.prototype, 'toObject', thisify(toObjectIterable))
defineMethod(ExtMap.prototype, 'reduce', thisify(reduceIterable))
defineMethod(ExtMap.prototype, 'map', thisify(transformReturnValue(mapIterable, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'mapKeys', thisify(transformReturnValue(mapIterableKeys, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'mapValues', thisify(transformReturnValue(mapIterableValues, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'filter', thisify(transformReturnValue(filterIterable, ExtMap.fromIterable)))
