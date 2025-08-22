/**
 * Creates a function that merges arrays based on a predicate function.
 */
export function createArrayMerger<T>(predicate: (value: T, index: number, arr: T[]) => boolean) {
  return function arrMerge<E extends T>(target: E[], ...sources: E[][]) {
    for (const src of sources) {
      for (let i = 0; i < src.length; i++) {
        if (predicate(src[i], i, src)) {
          target[i] = src[i]
        }
      }
    }
    return target
  }
}
