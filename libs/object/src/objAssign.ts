import { createObjectMerger } from './createObjectMerger'

/**
 * Like Object.assign, but only copies source object property values != null.
 */
export const objAssign = createObjectMerger((value) => {
  return value != null
})
