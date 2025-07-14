/**
 * Determines if a given filepath is a UNC path.
 * @param filepath - The filepath to evaluate.
 * @returns A boolean indicating whether the filepath is a UNC path.
 */

export function isUnc(filepath: string): boolean {
  return /^[\\/]{2,}[^\\/]+[\\/]+[^\\/]+/.test(filepath)
}
