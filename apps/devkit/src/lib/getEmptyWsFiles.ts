import { glob } from 'glob'
import upath from 'upath'

/**
 * Gets an array of paths to empty files (0 bytes) in workspace directories.
 */
export async function getEmptyWsFiles(): Promise<string[]> {
  return (await glob('{libs,apps}/**/*', { withFileTypes: true, stat: true }))
    .filter((d) => {
      return d.isFile() && (d as unknown as { size: number }).size === 0
    })
    .map((d) => {
      return upath.relative(process.cwd(), upath.joinSafe(d.parentPath, d.name))
    })
}

//
if (import.meta.main) {
  void getEmptyWsFiles()
}
