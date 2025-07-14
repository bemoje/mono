/**
 * @example
 * type Named = WithRequired<{ name?: string; age?: number }, 'name'>
 *
 * becomes                -> { name:  string; age?: number }
 */
export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P]
}
