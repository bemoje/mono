import { Any } from '@mono/types'
import { arrGetOrDefault } from '@mono/array'
import { mapGetOrDefault } from './mapGetOrDefault'
import { objGetOrDefault } from '@mono/object'
import { GenericMap } from './types'
import { isGenericMap } from './isGenericMap'

/**
 * Get a value from an object. If the key is not found, the provided factory function is invoked and it's return-value is inserted at the given key and then returned.
 *
 * @example ```ts
 * getOrElse({ a: undefined }, 'a', () => 1)
 * // => 1
 * ```
 */
export function getOrDefault<K extends PropertyKey, V>(object: Record<K, V>, key: K, factory: (key: K) => V): V

/**
 * Get a value from a Map. If the key is not found, the provided factory function is invoked and it's return-value is inserted at the given key and then returned.
 *
 * @example ```ts
 * getOrElse(new Map(), 'a', () => 1)
 * // => 1
 * ```
 */
export function getOrDefault<K, V>(map: Map<K, V>, key: K, factory: (key: K) => V): V

/**
 * Get a value from a WeakMap. If the key is not found, the provided factory function is invoked and it's return-value is inserted at the given key and then returned.
 *
 * @example ```ts
 * getOrElse(new WeakMap(), {}, () => 1)
 * // => 1
 * ```
 */
export function getOrDefault<K extends object, V>(map: WeakMap<K, V>, key: K, factory: (key: K) => V): V

/**
 * Get a value from a map-like object. If the key is not found, the provided factory function is invoked and it's return-value is inserted at the given key and then returned.
 *
 * @example ```ts
 * class MyMap<K, V> {
 *   get(key: K): V | undefined
 *   set(key: K, value: V): this
 * }
 * getOrElse(new MyMap(), 'a', () => 1)
 * ```
 */
export function getOrDefault<K, V>(map: GenericMap<K, V, 'get' | 'set' | 'has'>, key: K, factory: (key: K) => V): V

/**
 * Get a value from an array. If the key is not found, the provided factory function is invoked and it's return-value is inserted at the given key and then returned.
 *
 * @example ```ts
 * getOrElse([], 0, () => 1)
 * // => 1
 * ```
 */
export function getOrDefault<V>(array: V[], index: number, factory: (index: number) => V): V

/**
 *
 */
export function getOrDefault<K, V>(target: Any, key: Any, factory: Any): V {
  if (Array.isArray(target)) {
    return arrGetOrDefault(target, key as number, factory)
  }
  if (isGenericMap(target, ['get', 'set', 'has'])) {
    return mapGetOrDefault(target as GenericMap<K, V, 'get' | 'set' | 'has'>, key as K, factory)
  }
  return objGetOrDefault(target, key as PropertyKey, factory)
}

getOrDefault.object = objGetOrDefault
getOrDefault.array = arrGetOrDefault
getOrDefault.map = mapGetOrDefault
