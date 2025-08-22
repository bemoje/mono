/**
 * Number keys of T.
 */
export type NumberKeyOf<T> = Extract<keyof T, number>
