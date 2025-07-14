import upath from 'upath'
import { getRepoRootDirpath } from '../../s/util/getRepoRootDirpath.mjs'
import { buildFile } from '../../s/util/buildFile.mjs'
import fs from 'fs-extra'
import { semverVersionBump } from '../../s/monorepo/semverVersionBump.cjs'

const repoRootDirpath = getRepoRootDirpath()
const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')

// console.debug({
//   repoRootDirpath,
//   wsDirpath,
//   tsconfigFilepath,
// })

///////////

const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))
const version = pkg.version || '0.0.0'

const INPATH = upath.joinSafe(wsDirpath, 'src', 'main.ts')

await buildFile(INPATH, upath.joinSafe(repoRootDirpath, 's', `devkit_v${version}.cjs`), tsconfigFilepath, {
  minify: true,
  sourcemap: false,
})

pkg.version = semverVersionBump(version, 'patch')
await fs.writeJson(upath.joinSafe(wsDirpath, 'package.json'), pkg, { spaces: 2 })
