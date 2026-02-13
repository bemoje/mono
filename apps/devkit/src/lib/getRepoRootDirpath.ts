import upath from 'upath'

let _cached: string | undefined

/**
 * Gets the repository root directory path.
 * Works in both ESM (import.meta.dirname) and CJS (__dirname or process.cwd()) contexts.
 */
export function getRepoRootDirpath(): string {
  if (_cached) return _cached
  // Try import.meta.dirname first (ESM), then __dirname (CJS), then process.cwd()
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.dirname) ||
    (typeof __dirname !== 'undefined' && __dirname) ||
    process.cwd()
  const path = upath.normalizeSafe(raw)
  const parts = path.split('/')
  const repoRootIndex = parts.findLastIndex((part) => part === 'mono')
  if (repoRootIndex === -1) {
    // Fallback to cwd when running outside the repo (e.g. via npx)
    _cached = upath.normalizeSafe(process.cwd())
    return _cached
  }
  _cached = parts.slice(0, repoRootIndex + 1).join('/')
  return _cached
}
