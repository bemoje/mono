/**
 * Same as keyof T, but lets you specify the type of key to extract.
 */
export type KeyOf<T, K extends string | number | symbol> = Extract<keyof T, K>
