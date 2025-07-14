/**
 * Converts CRLF line endings to LF in TypeScript code.
 */
export function tsCrlfToLf(code: string) {
  return code.replace(/\r\n/g, '\n')
}
