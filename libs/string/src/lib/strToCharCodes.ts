/**
 * Converts a string to an array of character codes.
 * @param string The string to convert.
 * @example ```ts
 * strToCharCodes('Hello');
 * //=> [72, 101, 108, 108, 111]
 * ```
 */
export function strToCharCodes(string: string): number[] {
  const result = new Array(string.length)
  for (let i = 0; i < string.length; i++) {
    result[i] = string.codePointAt(i)
  }
  return result
}
