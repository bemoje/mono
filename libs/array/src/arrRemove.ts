/**
 * Remove a given element from a copy of a given array and return the resulting array.
 */
export function arrRemove<T>(arr: T[], elementToRemove: T): T[] {
  return arr.filter((element) => element !== elementToRemove)
}
