/**
 * Converts a given number of bytes into megabytes.
 *
 * @param bytes - The number of bytes to convert.
 * @returns The equivalent number of megabytes.
 *
 * @example
 * bytesToMegabytes(1048576);
 * //=> 1
 */
export function bytesToMegabytes(bytes: number): number {
  return bytes / (1024 * 1024)
}
