import { pull } from 'es-toolkit'

/**
 * Remove elements in-place from an array.
 */
export function arrRemoveMutable<T>(arr: T[], ...elementToRemove: T[]): void {
  pull(arr, elementToRemove)
}
