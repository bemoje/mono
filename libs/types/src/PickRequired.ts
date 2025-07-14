/**
 * @example
 * PickRequired<{ a: string, b?: string }> //=> { a: string }
 */
export type PickRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]-?: T[K]
}
