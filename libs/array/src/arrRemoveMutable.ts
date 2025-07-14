/**
 * Remove elements in-place from an array.
 */
export function arrRemoveMutable<T>(arr: T[], elementToRemove: T): void {
  let index = arr.indexOf(elementToRemove)
  while (index !== -1) {
    arr.splice(index, 1)
    index = arr.indexOf(elementToRemove)
  }
}
