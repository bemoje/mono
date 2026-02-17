/**
 * Self-contained build script for devkit.
 * This file must NOT import from s/ or any workspace - it is the bootstrap entry point.
 */
import upath from 'upath'
import fs from 'fs-extra'
import * as esbuild from 'esbuild'
import cp from 'node:child_process'

// inline repo root discovery
const repoRootDirpath = (() => {
  const parts = upath.normalizeSafe(import.meta.dirname).split('/')
  const i = parts.findLastIndex((p) => p === 'mono')
  if (i === -1) throw new Error('Could not find repo root directory')
  return parts.slice(0, i + 1).join('/')
})()

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)

const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')

const distDirpath = upath.joinSafe(repoRootDirpath, '.dist')
const indexOutFilepath = upath.joinSafe(distDirpath, wsDirname + '.cjs')
const indexOutFileTemp = upath.joinSafe(distDirpath, wsDirname + '-temp.cjs')

// ensure package details are consistent across package.json and source code, and that version is unique on npm
void (await (async () => {
  const packageJsonDirpath = upath.joinSafe(wsDirpath, 'package.json')
  const pkg = await fs.readJson(packageJsonDirpath)

  // check if version already exists on npm, and if so, bump patch version
  const npmVersion = cp.execSync(`npm view ${pkg.name} version`, { encoding: 'utf8' })
  if (npmVersion.trim() === pkg.version) {
    const semver = pkg.version.split('.')
    semver[2] = (parseInt(semver[2]) + 1).toString()
    pkg.version = semver.join('.')
    console.info(`Version ${npmVersion} already exists on npm. Bumping version to ${pkg.version}...`)
    await fs.writeFile(packageJsonDirpath, JSON.stringify(pkg, null, 2) + '\n')
  }

  // update version in source code
  const cmdVersionFilepath = upath.joinSafe(wsDirpath, 'src', 'core', 'version.ts')
  const cmdVersionSrc = await fs.readFile(cmdVersionFilepath, 'utf-8')
  const cmdVersionSplit = cmdVersionSrc.split(/['"`]/)
  const cmdVersion = cmdVersionSplit[1]
  if (cmdVersion !== pkg.version) {
    console.info(
      `Version mismatch: src/core/version.ts (${cmdVersion}) vs package.json (${pkg.version}). Updating src/core/version.ts...`,
    )
    const cmdVersionSrcNew = cmdVersionSplit.map((part, i) => (i === 1 ? pkg.version : part)).join('`')
    await fs.writeFile(cmdVersionFilepath, cmdVersionSrcNew)
  }

  // update description in source code
  const cmdDescriptionFilepath = upath.joinSafe(wsDirpath, 'src', 'core', 'description.ts')
  const cmdDescriptionSrc = await fs.readFile(cmdDescriptionFilepath, 'utf-8')
  const cmdDescriptionSplit = cmdDescriptionSrc.split(/['"`]/)
  const cmdDescription = cmdDescriptionSplit[1]
  if (cmdDescription !== pkg.description) {
    console.info(
      `Description mismatch: src/core/description.ts (${cmdDescription}) vs package.json (${pkg.description}). Updating src/core/description.ts...`,
    )
    const cmdDescriptionSrcNew = cmdDescriptionSplit.map((part, i) => (i === 1 ? pkg.description : part)).join('`')
    await fs.writeFile(cmdDescriptionFilepath, cmdDescriptionSrcNew)
  }
})())

// build with esbuild
await esbuild.build({
  entryPoints: [indexFilepath],
  bundle: true,
  outfile: indexOutFileTemp,
  tsconfig: tsconfigFilepath,
  platform: 'node',
  format: 'cjs',
  target: ['node20', 'es2022'],
  minify: true,
  keepNames: true,
  mainFields: ['module', 'main'],
  sourcemap: true,
  treeShaking: true,
  external: ['esbuild'],
  banner: { js: '#!/usr/bin/env node' },
  logOverride: { 'empty-import-meta': 'silent' },
})

// validate the built artifact
const stdout = cp.execSync('node ' + indexOutFileTemp + ' --help', { cwd: repoRootDirpath }).toString()
if (typeof stdout !== 'string' || !stdout) {
  console.error('Build did not produce a valid module: ' + indexOutFileTemp)
  process.exit(1)
}

// swap temp → final
await fs.remove(indexOutFilepath)
await fs.rename(indexOutFileTemp, indexOutFilepath)
await fs.remove(indexOutFilepath + '.map')
if (await fs.pathExists(indexOutFileTemp + '.map')) {
  await fs.rename(indexOutFileTemp + '.map', indexOutFilepath + '.map')
}

// copy to apps/devkit/dist/ for npm publishing
const npmDistDir = upath.joinSafe(wsDirpath, 'dist')
await fs.ensureDir(npmDistDir)
await fs.copy(indexOutFilepath, upath.joinSafe(npmDistDir, 'devkit.cjs'))
if (await fs.pathExists(indexOutFilepath + '.map')) {
  await fs.copy(indexOutFilepath + '.map', upath.joinSafe(npmDistDir, 'devkit.cjs.map'))
}

// create bin wrapper for cross-platform npx support
await fs.writeFile(upath.joinSafe(npmDistDir, 'cli.mjs'), '#!/usr/bin/env node\nimport("./devkit.cjs");\n')
