/**
 * File builder utility for compiling TypeScript files with esbuild.
 * Handles bundling, source maps, and temporary file management during the build process.
 */
import * as esbuild from 'esbuild'
import upath from 'upath'
import fs from 'fs-extra'
import { getRepoRootDirpath } from './getRepoRootDirpath.mjs'
import { relativeImportPath } from './relativeImportPath.mjs'
import cp from 'child_process'

const cwd = process.cwd()

export async function buildFile(filepath, outfile, tsconfig, optionsOverride = {}) {
  const parsed = upath.parse(outfile)
  const outfileTemp = upath.joinSafe(parsed.dir, parsed.name + '-temp' + upath.extname(outfile))

  const result = await esbuild.build({
    entryPoints: [filepath],
    bundle: true,
    outfile: outfileTemp,
    tsconfig: tsconfig,
    platform: 'node',
    format: 'cjs',
    target: ['node20'],
    external: [],
    minify: false,
    minifyWhitespace: false,
    minifySyntax: false,
    minifyIdentifiers: false,
    keepNames: true,
    mainFields: ['module', 'main'],
    sourcemap: true,
    treeShaking: true,
    ...optionsOverride,
  })

  // ensure the build produced a module that can be imported
  process.chdir(getRepoRootDirpath())
  if (upath.basename(filepath) !== 'main.ts') {
    const importPath = relativeImportPath(import.meta.filename, outfileTemp)
    const loadedBuiltModule = await import(importPath)
    Object.entries(loadedBuiltModule)
  } else {
    const stdout = cp.execSync('node ' + outfileTemp + ' --help').toString()
    if (typeof stdout !== 'string' || !stdout) {
      console.error('Build did not produce a valid module: ' + outfileTemp)
      process.exit(1)
    }
  }

  process.chdir(cwd)

  // remove the temporary file and rename the output file
  await fs.remove(outfile)
  await fs.rename(outfileTemp, outfile)
  await fs.remove(outfile + '.map')
  await fs.rename(outfileTemp + '.map', outfile + '.map')

  return result
}
