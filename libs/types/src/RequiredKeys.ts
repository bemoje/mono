/**
 * @example
 * RequiredKeys<{ a: string, b?: string }> //=> 'a'
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]
