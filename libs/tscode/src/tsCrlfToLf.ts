/**
 * Converts CRLF line endings to LF in TypeScript code.
 * This function normalizes line endings from Windows-style (CRLF) to Unix-style (LF)
 * for consistent processing across different operating systems.
 * @param code - The TypeScript code string to normalize
 * @returns The code with LF line endings
 * @example
 * ```typescript
 * tsCrlfToLf('line1\r\nline2\r\nline3') // 'line1\nline2\nline3'
 * ```
 */
export function tsCrlfToLf(code: string) {
  return code.replaceAll(/\r+\n/g, '\n')
}
