/**
 * Check if a file extension is valid.
 *
 * Invalid:
 * - empty string
 * - single dot: "."
 * - illegal characters: <>"|?*:
 *
 * @param ext - The file extension to check.
 */

export function isExtValid(ext: string): boolean {
  return !!ext && ext !== '.' && !/[<>"|?*:]/.test(ext)
}
