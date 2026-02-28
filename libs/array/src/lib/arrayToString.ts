/**
 * Short and condensed string representation of an array, easy to read for error outputs or similar.
 */
export function arrayToString<T>(array: T[]): string {
  return `[${array
    .map((item: T) => {
      return item == null ? String(item) : Array.isArray(item) ? arrayToString(item) : item.toString()
    })
    .join(',')}]`
}
