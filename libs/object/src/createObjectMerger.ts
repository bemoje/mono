import { Any } from '@mono/types'

/**
 * Creates a function that merges objects based on a predicate function.
 */
export function CreateObjectMerger(predicate: (value: Any, key: string, obj: Record<string, Any>) => boolean) {
  return function objMerge(target: Record<string, Any>, ...sources: Record<string, Any>[]) {
    for (const src of sources) {
      for (const [key, value] of Object.entries(src)) {
        if (predicate(value, key, src)) {
          target[key] = value
        }
      }
    }
    return target
  }
}
