/**
 * Converts a given number of bytes into kilobytes.
 *
 * @param bytes - The number of bytes to convert.
 * @returns The equivalent number of kilobytes.
 *
 * @example
 * bytesToKilobytes(524288)
 * //=> 1
 */
export function bytesToKilobytes(bytes: number): number {
  return bytes / 1024
}
