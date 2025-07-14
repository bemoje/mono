/**
 * Removes consecutive whitespace characters in a string and replaces them with a single space.
 * @param string The string to be processed.
 * @example ```ts
 * strNoConsecutiveWhitespace('Hello   World');
 * //=> 'Hello World'
 * ```
 */
export function strNoConsecutiveWhitespace(string: string): string {
  return string.replace(/\s{2,}/g, ' ')
}
