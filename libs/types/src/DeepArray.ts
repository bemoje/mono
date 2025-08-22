import { DeepObject } from './DeepObject'

/**
 * Recursively defined array that can contain objects+arrays with values of a given type V.
 */
export type DeepArray<V, K extends PropertyKey = PropertyKey> =
  | Array<V | DeepObject<V, K> | DeepArray<V, K>>
  | []
  | V[]

/**
 * Recursively defined array that can contain only arrays (excl. objects) with values of a given type V.
 */
export type StrictlyDeepArray<V> = Array<V | StrictlyDeepArray<V>>
