/**
 * Removes all new line characters from a string.
 * @param string The string from which to remove new line characters.
 * @param replaceWith The string to replace new line characters with. Default is an empty string.
 * @example ```ts
 * strRemoveNewLines('Hello\nWorld');
 * //=> 'HelloWorld'
 * ```
 * @example ```ts
 * const str = 'Hello\nWorld';
 * const result = strRemoveNewLines(str, ' ');
 * console.log(result); // 'Hello World'
 * ```
 */
export function strRemoveNewLines(string: string, replaceWith = ''): string {
  return string.replace(/\r*\n/g, replaceWith)
}
