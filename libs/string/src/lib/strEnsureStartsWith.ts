/**
 * Ensures that a string starts with a specified substring. If the string already starts with the specified substring, it is returned as is. Otherwise, the substring is appended to the end of the string.
 * @param string The string to be processed.
 * @param startsWith The substring that the string should end with.
 * @example ```ts
 * strEnsureStartsWith('json', '.');
 * //=> '.json'
 * strEnsureStartsWith('.json', '.');
 * //=> '.json'
 * ```
 */
export function strEnsureStartsWith(string: string, startsWith: string): string {
  return string.startsWith(startsWith) ? string : startsWith + string
}
