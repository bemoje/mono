/**
 * Returns an array type excluding the first element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never
