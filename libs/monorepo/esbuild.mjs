import fs from 'fs-extra'
import upath from 'upath'
import { buildFile } from '../../s/util/buildFile.mjs'
import { buildStats } from '../../s/util/buildStats.mjs'
import { getWsPaths } from '../../s/util/getWsPaths.mjs'

const { wsDir, wsDirname, distDir, tsconfig, indexTs, indexCjs, toRelative } = getWsPaths(import.meta.dirname)

await buildFile(indexTs, indexCjs, tsconfig, {})

console.debug({
  tsconfig: toRelative(tsconfig),
  infile: toRelative(indexTs),
  outfile: toRelative(indexCjs),
  stats: await buildStats(indexCjs),
})

///////////

const utilDir = upath.joinSafe(wsDir, 'src', 'util')
const utilFiles = await fs.readdir(utilDir)
const utilInOut = utilFiles
  .filter((file) => !file.includes('.test.ts'))
  .map((file) => [
    upath.joinSafe(utilDir, file),
    upath.changeExt(upath.joinSafe(distDir, wsDirname, 'util', file), '.cjs'),
  ])

await fs.emptyDir(upath.joinSafe(distDir, wsDirname, 'util'))

await Promise.all(
  utilInOut.map(async ([infile, outfile]) => {
    await buildFile(infile, outfile, tsconfig, {
      minify: true,
      sourcemap: false,
      // external: ['typescript'],
    })
    // console.debug({
    //   tsconfig: toRelative(tsconfig),
    //   infile: toRelative(infile),
    //   outfile: toRelative(outfile),
    //   stats: await buildStats(outfile),
    // })
  }),
)
