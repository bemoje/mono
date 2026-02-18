import { JsonPrimitive } from 'type-fest'

/**
 * Utility type to pick only the primitive properties from a given type T. Used for defining the shape of ignore entries in UserConfig, allowing users to specify which entries to ignore based on primitive property values (e.g., name, position) without needing to specify complex nested structures.
 */
export type PickPrimitive<T> = {
  [K in keyof T as IsPrimitive<T[K]> extends true ? K : never]: T[K]
}

type IsPrimitive<T> = T extends JsonPrimitive | undefined ? true : false
