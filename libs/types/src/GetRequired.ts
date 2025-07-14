/**
 * @example
 * GetRequired<{ a: string, b?: string }> //=> 'a'
 */
export type GetRequired<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]
