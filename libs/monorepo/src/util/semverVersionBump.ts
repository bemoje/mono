/**
 * Bumps the semantic versioning (SemVer) of a given version string or array based on the specified level.
 * The function supports 'major', 'minor', and 'patch' levels.
 *
 * @remarks
 * This function will mutate the original version if it's an array.
 *
 * @param version - The current version. It can be a string (e.g., '1.0.0') or an array of strings or numbers (e.g., ['1', '0', '0'] or [1, 0, 0]).
 * @param level - The level of the version bump. It can be 'major', 'minor', or 'patch'.
 *
 * @returns The bumped version as a string.
 *
 * @example
 * ```ts
 * semverVersionBump('1.0.0', 'major'); // '2.0.0'
 * semverVersionBump([1, 0, 4], 'minor'); // '1.1.0'
 * semverVersionBump(['1', '0', '0'], 'patch'); // '1.0.1'
 * ```
 */
export function semverVersionBump(
  version: string | string[] | number[],
  level: 'major' | 'minor' | 'patch',
): string {
  const arr = (typeof version === 'string' ? version.split('.') : version).map(Number)
  if (level === 'major') {
    arr[0] += 1
    arr[1] = 0
    arr[2] = 0
  } else if (level === 'minor') {
    arr[1] += 1
    arr[2] = 0
  } else if (level === 'patch') {
    arr[2] += 1
  }
  return arr.join('.')
}
