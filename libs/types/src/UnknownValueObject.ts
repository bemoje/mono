/**
 * Represents an object with unknown values.
 */
export type UnknownValueObject<T = object> = {
  [K in keyof T]: unknown
}
