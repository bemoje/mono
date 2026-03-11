import type { InspectOptions } from 'util'
import { View } from '@mono/composition'
import { defineMethod } from '@mono/object/defineMethod'
import { entriesArray } from './entriesArray'
import { entriesOf } from '@mono/object/entriesOf'
import { filterIterableValues } from '@mono/iter/filterIterableValues'
import { inheritProxifiedPrototype } from '@mono/composition'
import { inspect } from 'util'
import { isIterable } from 'iter-tools'
import { keysArray } from './keysArray'
import { mapGetOrDefault } from './mapGetOrDefault'
import { mapIterableKeys } from '@mono/iter/mapIterableKeys'
import { mapIterableValues } from '@mono/iter/mapIterableValues'
import { mapLoad } from './mapLoad'
import { mapReverse } from './mapReverse'
import { mapUpdate } from './mapUpdate'
import { reduceIterableValues } from '@mono/iter/reduceIterableValues'
import { sort } from './sort'
import { sortByKeys } from './sortByKeys'
import { sortByValues } from './sortByValues'
import { thisify } from '@mono/fn/thisify'
import { toMap } from './toMap'
import { toObjectIterable } from '@mono/iter/toObjectIterable'
import { transformReturnValue } from '@mono/fn/transformReturnValue'
import { valuesArray } from './valuesArray'

declare module './ExtMap' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface ExtMap<K = any, V = any> extends Map<K, V> {
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
    toObject<K, V>(): Record<Extract<K, PropertyKey> | string, V>
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
  constructor(obj?: Record<Extract<K, PropertyKey>, V>)
  constructor(arg?: Record<Extract<K, PropertyKey>, V> | Iterable<readonly [K, V]> | null | undefined) {
    super(
      new Map(
        isIterable(arg) ? arg
        : arg ? entriesOf(arg)
        : undefined
      )
    )
  }

  /**
   * Creates a new ExtMap instance from a regular object.
   *
   * @param obj - An object whose key-value pairs will be used to initialize the map
   * @returns A new ExtMap instance containing the entries from the object
   */
  static fromObject<K extends PropertyKey, V>(obj: Record<K, V>): ExtMap<K, V> {
    return new ExtMap(Object.entries(obj)) as ExtMap<K, V>
  }

  /**
   * Creates a new ExtMap instance from an iterable of key-value pairs.
   *
   * @param entries - An iterable of key-value pairs to initialize the map
   * @returns A new ExtMap instance containing the provided entries
   */
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
defineMethod(ExtMap.prototype, 'toObject', thisify(toObjectIterable))
defineMethod(ExtMap.prototype, 'toMap', thisify(toMap))
defineMethod(ExtMap.prototype, 'reduce', thisify(reduceIterableValues))
defineMethod(ExtMap.prototype, 'map', thisify(transformReturnValue(mapIterableValues, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'mapKeys', thisify(transformReturnValue(mapIterableKeys, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'mapValues', thisify(transformReturnValue(mapIterableValues, ExtMap.fromIterable)))
defineMethod(ExtMap.prototype, 'filter', thisify(transformReturnValue(filterIterableValues, ExtMap.fromIterable)))
