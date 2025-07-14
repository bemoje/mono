import { CreateArrayMerger } from './createArrayMerger'

/**
 * Array assignment function that merges arrays excluding null and undefined values.
 */
export const arrAssign = CreateArrayMerger((value) => value != null)
