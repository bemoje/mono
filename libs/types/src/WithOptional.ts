/**
 * @example
 * type Named = WithOptional<{ name: string; age: number }, 'name'>
 *
 * becomes                -> { name?:  string; age: number }
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
