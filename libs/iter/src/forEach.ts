import { forEachIterableEntries } from './forEachIterableEntries'

/**
 * Iterate a `Map` (or `ReadonlyMap`). Callback receives `(value, key)`.
 */
export function forEach<K, V>(map: ReadonlyMap<K, V>, callback: (value: V, key: K) => void): void

/** Iterate a `Set` (or `ReadonlySet`). Callback receives `(value)`. */
export function forEach<V>(set: ReadonlySet<V>, callback: (value: V) => void): void

/** Iterate an array. Callback receives `(value, index)`. */
export function forEach<V>(array: readonly V[], callback: (value: V, index: number) => void): void

/** Iterate a plain object. Callback receives `(value, key)`. */
export function forEach<K extends string, V>(object: Record<K, V>, callback: (value: V, key: K) => void): void

/** Iterate any `Iterable`. Callback receives `(value)`. */
export function forEach<V>(iterable: Iterable<V>, callback: (value: V) => void): void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forEach(target: any, callback: any): void {
  if (Symbol.iterator in target) {
    if (target instanceof Map) {
      return target.forEach(callback)
    }
    if (target instanceof Set) {
      return target.forEach(callback)
    }
    if (Array.isArray(target)) {
      return target.forEach(callback)
    }
    for (const value of target) {
      callback(value)
    }
    return
  }
  return forEachIterableEntries(Object.entries(target), callback)
}
