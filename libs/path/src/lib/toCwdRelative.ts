import upath from 'upath'

/**
 * Solve the relative path from the process.cwd() path to the {p} path.
 * At times we have two absolute paths, and we need to derive the relative path from one to the other.
 * This is actually the reverse transform of path.resolve.
 */
export function toCwdRelative(p: string) {
  return upath.relative(process.cwd(), p)
}
