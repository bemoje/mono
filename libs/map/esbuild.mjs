import { execSync } from 'node:child_process'
import upath from 'upath'

const dirname = upath.basename(import.meta.dirname)
execSync(`npx @bemoje/devkit build lib ${dirname}`, { stdio: 'inherit' })
