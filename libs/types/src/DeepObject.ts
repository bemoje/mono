import { DeepArray } from './DeepArray'

/**
 * Recursively defined object with objects+arrays with values of a given type V.
 */
export type DeepObject<V, K extends PropertyKey = PropertyKey> = {
  [_ in K]?: V | DeepObject<V, K> | DeepArray<V, K> | V[]
}

/**
 * Recursively defined array that can contain only objects (excl. arrays) with values of a given type V.
 */
export type StrictlyDeepObject<V, K extends PropertyKey = PropertyKey> = {
  [_ in K]?: V | StrictlyDeepObject<V, K>
}
