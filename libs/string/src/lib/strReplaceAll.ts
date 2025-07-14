/**
 * Replaces all occurrences of a substring in a string with a specified replacement.
 * @param input The input string.
 * @param replace The substring to be replaced.
 * @param replaceWith The replacement string.
 * @param flags Optional. The flags for the regular expression. Defaults to 'g'.
 * @example ```ts
 * const input = 'Hello, world!';
 * const replace = 'o';
 * const replaceWith = '0';
 * strReplaceAll(input, replace, replaceWith);
 * //=> 'Hell0, w0rld!'
 * ```
 */
export function strReplaceAll(input: string, replace: string, replaceWith: string, flags = 'g'): string {
  if (!input || !replace) return input
  return input.replace(new RegExp(replace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replaceWith)
}
