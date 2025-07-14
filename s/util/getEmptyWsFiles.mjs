import { glob } from 'glob'
import path from 'upath'

export async function getEmptyWsFiles() {
  return (await glob('{libs,apps}/**/*', { withFileTypes: true, stat: true }))
    .filter((d) => {
      return d.isFile() && d.size === 0
    })
    .map((d) => {
      return path.relative(process.cwd(), path.joinSafe(d.parentPath, d.name))
    })
}
