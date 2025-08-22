/**
 * Splits a string by a specified delimiter and trims each resulting substring.
 * Optionally, it can also remove empty lines.
 * @param string The string to be split and trimmed.
 * @param delimiter The delimiter to split the string by.
 * @param removeEmptyLines Optional parameter. If true, removes empty lines from the resulting array. Default is false.
 * @example ```ts
 * strSplitAndTrim("  Hello ;  world ; ". ";", true;
 * //=> ["Hello", "world"]
 * strSplitAndTrim("  Hello ;  world ; ". ";", false;
 * //=> ["Hello", "world", ""]
 * ```
 */
export function strSplitAndTrim(string: string, delimiter: string, removeEmptyLines = false): string[] {
  const lines = string.split(delimiter).map((s) => s.trim())
  return removeEmptyLines ? lines.filter((s) => !!s.trim()) : lines
}
