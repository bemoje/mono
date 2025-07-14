/**
 * Returns the static string-property keys of a class but without the natively built-in keys 'length', 'name', and 'prototype'.
 */
export function staticClassKeysOf<T extends new (...args: any[]) => unknown>(cls: T): StaticClassKeyof<T>[] {
  const keys = Object.getOwnPropertyNames(cls)
  return keys.filter((key) => !ignoreKeys.includes(key as IgnoreKey)) as StaticClassKeyof<T>[]
}

/**
 * Returns the static string-property keys of a class but without the natively built-in keys 'length', 'name', and 'prototype'.
 */
export type StaticClassKeyof<T extends new (...args: any[]) => unknown> = Exclude<keyof T, IgnoreKey>

/**
 * Keys always present in any class object.
 */
const ignoreKeys = ['length', 'name', 'prototype'] as const
type IgnoreKey = (typeof ignoreKeys)[number]
