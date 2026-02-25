import { createArrayMerger } from './createArrayMerger'

/**
 * Array assignment function that merges arrays excluding null and undefined values.
 */
export const arrAssign = createArrayMerger((value) => {
  return value != null
})
