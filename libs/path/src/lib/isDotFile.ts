/**
 * Determines if a given filepath is a dotfile.
 * @param filepath - The filepath to evaluate.
 * @returns A boolean indicating whether the filepath is a dotfile.
 */

export function isDotFile(filepath: string): boolean {
  return /(?:^|[\\/])(\.(?!\.)[^\\/]+)$/.test(filepath)
}
