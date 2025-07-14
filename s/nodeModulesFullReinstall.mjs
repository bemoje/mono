import { glob } from 'glob'
import fs from 'fs-extra'
import upath from 'upath'
import { confirmPrompt } from '../.dist/terminal.cjs'
import { getRepoRootDirpath } from './repoutil.mjs'
import { execSync } from 'child_process'

const paths = (
  await glob([
    '{apps,libs,packages}/*/{node_modules,package-lock.json}',
    'node_modules',
    'yarn.lock',
    'package-lock.json',
  ])
)
  .map((dp) => upath.normalize(dp))
  .sort()

console.log('------')
paths.forEach((p, i) => console.log(i, p))
console.log('------')
const shouldDelete = await confirmPrompt('Delete ' + String(paths.length) + ' files? ')

if (!shouldDelete) {
  console.log('aborted by user')
  process.exit(0)
}

for (const p of paths) {
  if (await fs.exists(p)) {
    await fs.remove(p)
  }
}

console.log('deleted')

execSync('yarn cache clear', {
  stdio: 'inherit',
  cwd: getRepoRootDirpath(),
})

execSync('yarn install', {
  stdio: 'inherit',
  cwd: getRepoRootDirpath(),
})
