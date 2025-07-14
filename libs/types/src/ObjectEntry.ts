/**
 * An element of Object.entries(o) as a type.
 */
export type ObjectEntry<T> = {
  [K in Extract<keyof T, string>]: [K, T[K]]
}[Extract<keyof T, string>]
