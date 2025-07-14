import { CreateObjectMerger } from './createObjectMerger'

/**
 * Like Object.assign, but only copies source object property values != null.
 */
export const objAssign = CreateObjectMerger((value) => value != null)
