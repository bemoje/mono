import upath from 'upath'
import { getRepoRootDirpath } from '../../s/util/getRepoRootDirpath.mjs'
import { buildFile } from '../../s/util/buildFile.mjs'

const repoRootDirpath = getRepoRootDirpath()
const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)
const distDirpath = upath.joinSafe(repoRootDirpath, '.dist')
const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')

// console.debug({
//   repoRootDirpath,
//   wsDirpath,
//   wsDirname,
//   tsconfigFilepath,
//   distDirpath,
// })

///////////

const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')
const indexOutFilepath = upath.joinSafe(distDirpath, wsDirname + '.cjs')

// console.debug({
//   indexFilepath,
//   indexOutFilepath,
// })

await buildFile(indexFilepath, indexOutFilepath, tsconfigFilepath, {
  minify: true,
})
