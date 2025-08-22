/**
 * Simple utility to convert Windows paths to POSIX format.
 * Can be used as a CLI script by passing a path as an argument.
 */
import upath from 'upath'

if (process.argv[2]) {
  const normalized = upath.normalizeSafe(process.argv[2])
  console.log(normalized)
}
