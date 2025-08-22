import upath from 'upath'
import { walkDirectory } from '@mono/fs'

const dir = upath.normalizeSafe(process.cwd())
const dirname = upath.dirname(dir)
const basename = upath.basename(dir)
console.log({ dir, dirname, basename })

const walkResult = walkDirectory(dir, { maxDepth: 1 })
console.log(walkResult)
