/**
 * @example
 * PickOptional<{ a: string, b?: string }> //=> { b?: string }
 */
export type PickOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
}
