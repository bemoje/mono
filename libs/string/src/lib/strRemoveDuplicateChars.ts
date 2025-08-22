/**
 * Removes duplicate characters from a string.
 * @throws Will throw an error if the provided argument is not a string.
 * @param string The string from which to remove duplicate characters.
 * @example ```ts
 * strRemoveDuplicateChars('hello');
 * //=> 'helo'
 * ```
 */
export function strRemoveDuplicateChars(string: string): string {
  return Array.from(new Set(string)).join('')
}
