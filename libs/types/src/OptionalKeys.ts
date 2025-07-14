/**
 * @example
 * OptionalKeys<{ a: string, b?: string }> //=> 'b
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]
