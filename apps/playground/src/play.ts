import path from 'upath'
import { walkDirectory } from '@mono/fs'

const dir = path.normalizeSafe(process.cwd())
const dirname = path.dirname(dir)
const basename = path.basename(dir)
console.log({ dir, dirname, basename })

const walkResult = walkDirectory(dir, { maxDepth: 1 })
console.log(walkResult)
