/**
 * Returns an array of all unique object keys found in an array of objects.
 * @template T - The type of values in the input objects.
 * @returns An array of unique keys present in the input objects.
 * @param objects The array of objects.
 * @example ```ts
 * const objects = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', gender: 'female' },
 *   { name: 'Bob', age: 30, gender: 'male' },
 * ];
 * arrObjectsUniqueKeys(objects);
 * //=> ['name', 'age', 'gender']
 * ```
 */
export function arrObjectsUniqueKeys<T>(objects: Record<string, T>[]): string[] {
  const keys = new Set<string>()
  for (const o of objects) {
    for (const key of Object.keys(o)) {
      keys.add(key)
    }
  }
  return Array.from(keys)
}
