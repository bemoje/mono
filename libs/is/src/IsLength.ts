import { ensureThat } from './ensureThat'

/**
 * Creates a function that validates if the length of the input is equal to the specified length.
 * The returned function accepts any value with a 'length' property and is named 'isLen' concatenated with the specified length.
 * @param length - The length to validate against.
 * @throws if length is not an integer.
 */
export function IsLength(length: number) {
  ensureThat(length, Number.isInteger)
  const func = function (input: unknown): boolean {
    return (
      input != null &&
      typeof (input as { length?: unknown }).length === 'number' &&
      (input as { length: number }).length === length
    )
  }
  Object.defineProperty(func, 'name', { value: 'isLen' + length })
  return func
}
