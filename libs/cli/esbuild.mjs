import { execSync } from 'node:child_process'
import upath from 'upath'

const dirname = upath.basename(import.meta.dirname)
execSync(`node ../../.dist/devkit.cjs build lib ${dirname}`, { stdio: 'inherit' })
