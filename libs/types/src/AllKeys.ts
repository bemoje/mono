import type { AllUnionFields } from 'type-fest'

/**
 * Type helper to get all unique keys of an array of objects. If there are no keys, it returns `string[]` to allow for any keys.
 * @template T - The type of values in the input objects.
 * @returns An array of unique keys present in the input objects, or `string[]` if there are no keys.
 * @example ```ts
 * const objects = [
 *   { a: 1, b: 2, d: 4 },
 *   { a: 1, b: 2, c: 3 },
 * ];
 * type AllKeysOfObjects = AllKeys<typeof objects>;
 * //=> "a" | "b" | "d" | "c"
 * ```
 */
export type AllKeys<T extends object[]> = (keyof AllUnionFields<T[number]>)[] extends never[]
  ? string[]
  : (keyof AllUnionFields<T[number]>)[]
