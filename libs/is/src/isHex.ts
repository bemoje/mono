/**
 * Checks if a string is a hexadecimal number.
 * Understands prefixes for hex colors, hex decimal and regexp unicode hex.
 * @remarks This function uses a regular expression to test if the input string is a hexadecimal number.
 * @param s The string to be tested.
 * @returns A boolean indicating whether the string is a hexadecimal number.
 * @example ```ts
 * isHex('123abc');
 * //=> true
 * isHex('123g');
 * //=> false
 * ```
 */
export function isHex(s: string): boolean {
  return /^(0x|0h|(\\?u)|#)?[0-9A-F]+$/i.test(s)
}
