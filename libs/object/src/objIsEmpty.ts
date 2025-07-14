/**
 * Checks if an object is empty.
 */
export function objIsEmpty<T>(obj: Record<string, T>): boolean {
  for (const _key in obj) {
    return false
  }
  return true
}
