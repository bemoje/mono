/**
 * Sort an object's keys.
 */
export function sortKeys<T extends object>(obj: T, compareFn?: (a: string, b: string) => number): T {
  const sorted: T = {} as T
  for (const key of Object.keys(obj).sort(compareFn)) {
    sorted[key as keyof T] = obj[key as keyof T]
  }
  return sorted
}
