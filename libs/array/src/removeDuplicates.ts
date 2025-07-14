/**
 * Remove duplicates from an array
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}
