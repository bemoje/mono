import type { BuildOptions } from 'esbuild'
import upath from 'upath'
import fs from 'fs-extra'
import cp from 'node:child_process'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { relativeImportPath } from './relativeImportPath'

const cwd = process.cwd()

/**
 * Compiles a TypeScript file to a bundled CJS output with esbuild.
 */
export async function buildFile(
  filepath: string,
  outfile: string,
  tsconfig: string,
  optionsOverride: BuildOptions = {},
) {
  const parsed = upath.parse(outfile)
  const outfileTemp = upath.joinSafe(parsed.dir, parsed.name + '-temp' + upath.extname(outfile))

  const esbuild = await import('esbuild')

  const result = await esbuild.build({
    entryPoints: [filepath],
    bundle: true,
    outfile: outfileTemp,
    tsconfig: tsconfig,
    platform: 'node',
    format: 'cjs',
    target: ['node20', 'es2022'],
    minify: false,
    minifyWhitespace: false,
    minifySyntax: false,
    minifyIdentifiers: false,
    keepNames: true,
    mainFields: ['module', 'main'],
    external: ['esbuild', 'type-fest'],
    sourcemap: true,
    treeShaking: true,
    ...optionsOverride,
  })

  // ensure the build produced a module that can be imported
  process.chdir(getRepoRootDirpath())
  if (upath.basename(filepath) !== 'main.ts') {
    const currentFile =
      (typeof import.meta !== 'undefined' && import.meta.filename) ||
      (typeof __filename !== 'undefined' && __filename) ||
      ''
    const importPath = relativeImportPath(currentFile, outfileTemp)
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
