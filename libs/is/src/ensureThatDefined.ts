import { ensureThat, TValidator } from './ensureThat'

/**
 * Same as ensureThat except that if the value is undefined, it is considered valid.
 */
export function ensureThatDefined<T, V extends T | unknown>(
  value: V,
  validator: TValidator<T, V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { Err?: new (...args: any[]) => object; args?: any[]; is?: boolean } = {},
) {
  if (value === undefined) return undefined
  return ensureThat(value, validator, options)
}
