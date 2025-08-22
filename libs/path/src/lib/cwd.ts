import upath from 'upath'

/**
 * Join paths starting from process.cwd()
 *
 * @example ```ts
 * // equivalent to:
 * path.join(process.cwd(), ...p)
 * ```
 */
export function cwd(...p: string[]) {
  return upath.joinSafe(process.cwd(), ...p)
}
