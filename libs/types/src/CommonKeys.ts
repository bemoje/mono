import type { RequiredKeysOf } from 'type-fest'
import type { SharedUnionFields } from 'type-fest'

/**
 * Type helper to get the common keys of an array of objects. If there are no common keys, it returns `string[]` to allow for any keys.
 * @template T - The type of values in the input objects.
 * @returns An array of keys that are present in all input objects, or `string[]` if there are no common keys.
 * @example ```ts
 * const objects = [
 *   { a: 1, b: 2, d: 4 },
 *   { a: 1, b: 2, c: 3 },
 * ];
 * type CommonKeysOfObjects = CommonKeys<typeof objects>;
 * //=> "a" | "b"
 * ```
 */
export type CommonKeys<T extends object[]> = RequiredKeysOf<
  SharedUnionFields<T[number]> & object
>[] extends never[]
  ? string[]
  : RequiredKeysOf<SharedUnionFields<T[number]> & object>[]
