/**
 * This matches the behavior of `{...a, ...b}`.
 */
export type Assign<A, B> = Omit<A, keyof B> & B
