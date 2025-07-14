/**
 * Checks if an array has any duplicate elements.
 * @param arr - The array to check for duplicates.
 * @returns A boolean indicating whether the array has duplicates.
 * @typeParam T - The type of elements in the array.
 */
export function arrHasDuplicates<T>(arr: T[]): boolean {
  const seen = new Set<T>()
  for (const e of arr) {
    if (seen.has(e)) return true
    seen.add(e)
  }
  return false
}
