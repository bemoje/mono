/**
 * @example
 * GetOptional<{ a: string, b?: string }> //=> 'b
 */
export type GetOptional<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]
