import * as esbuild from 'esbuild'
import cp from 'node:child_process'
import fs from 'fs-extra'
/**
 * Self-contained build script.
 * This file must NOT import from s/ or any workspace - it is the bootstrap entry point.
 */
import upath from 'upath'

// inline repo root discovery
const repoRootDirpath = (() => {
  const parts = upath.normalizeSafe(import.meta.dirname).split('/')
  const i = parts.findLastIndex((p) => {
    return p === 'mono'
  })
  if (i === -1) {
    throw new Error('Could not find repo root directory')
  }
  return parts.slice(0, i + 1).join('/')
})()

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)

const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')

const distDirpath = upath.joinSafe(wsDirpath, 'dist')
const indexOutFilepath = upath.joinSafe(distDirpath, `${wsDirname}.cjs`)
const indexOutFileTemp = upath.joinSafe(distDirpath, `${wsDirname}-temp.cjs`)

const packageJsonFilepath = upath.joinSafe(wsDirpath, 'package.json')
const pkg = await fs.readJson(packageJsonFilepath)

// ensure package details are consistent across package.json and source code, and that version is unique on npm
void (await (async () => {
  // check if version already exists on npm, and if so, bump patch version
  const npmVersion = cp.execSync(`npm view ${pkg.name} version`, { encoding: 'utf8' })
  if (npmVersion.trim() === pkg.version) {
    const semver = pkg.version.split('.')
    semver[2] = (parseInt(semver[2]) + 1).toString()
    pkg.version = semver.join('.')
    console.info(`Version ${npmVersion} already exists on npm. Bumping version to ${pkg.version}...`)
    await fs.outputFile(packageJsonFilepath, `${JSON.stringify(pkg, null, 2)}\n`)
  }

  // update version in source code
  const cmdVersionFilepath = upath.joinSafe(wsDirpath, 'src', 'core', 'version.ts')
  const cmdVersionSrc = await fs.readFile(cmdVersionFilepath, 'utf-8')
  const cmdVersionSplit = cmdVersionSrc.split(/['"`]/)
  const cmdVersion = cmdVersionSplit[1]
  if (cmdVersion !== pkg.version) {
    console.info(
      `Version mismatch: src/core/version.ts (${cmdVersion}) vs package.json (${pkg.version}). Updating src/core/version.ts...`
    )
    const cmdVersionSrcNew = cmdVersionSplit
      .map((part, i) => {
        return i === 1 ? pkg.version : part
      })
      .join('`')
    await fs.outputFile(cmdVersionFilepath, cmdVersionSrcNew)
  }

  // update description in source code
  const cmdDescriptionFilepath = upath.joinSafe(wsDirpath, 'src', 'core', 'description.ts')
  const cmdDescriptionSrc = await fs.readFile(cmdDescriptionFilepath, 'utf-8')
  const cmdDescriptionSplit = cmdDescriptionSrc.split(/['"`]/)
  const cmdDescription = cmdDescriptionSplit[1]
  if (cmdDescription !== pkg.description) {
    console.info(
      `Description mismatch: src/core/description.ts (${cmdDescription}) vs package.json (${pkg.description}). Updating src/core/description.ts...`
    )
    const cmdDescriptionSrcNew = cmdDescriptionSplit
      .map((part, i) => {
        return i === 1 ? pkg.description : part
      })
      .join('`')
    await fs.outputFile(cmdDescriptionFilepath, cmdDescriptionSrcNew)
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
  target: ['node20', 'esnext'],
  minify: false,
  keepNames: true,
  mainFields: ['module', 'main'],
  sourcemap: true,
  treeShaking: true,
  external: ['esbuild', 'type-fest', 'd', 'tsconfig-paths'],
  banner: { js: '#!/usr/bin/env node' },
  logOverride: { 'empty-import-meta': 'silent' },
})

// validate the built artifact
const stdout = cp.execSync(`node ${indexOutFileTemp} --help`, { cwd: repoRootDirpath }).toString()
if (typeof stdout !== 'string' || !stdout) {
  console.error(`Build did not produce a valid module: ${indexOutFileTemp}`)
  process.exit(1)
}

// swap temp → final
await fs.remove(indexOutFilepath)
await fs.rename(indexOutFileTemp, indexOutFilepath)
await fs.remove(`${indexOutFilepath}.map`)
if (await fs.pathExists(`${indexOutFileTemp}.map`)) {
  await fs.rename(`${indexOutFileTemp}.map`, `${indexOutFilepath}.map`)
}

// create bin wrapper for cross-platform npx support
await fs.outputFile(upath.joinSafe(distDirpath, 'cli.mjs'), `#!/usr/bin/env node\nimport("./${wsDirname}.cjs");\n`)

await fs.outputFile(
  upath.joinSafe(distDirpath, 'package.json'),
  JSON.stringify(
    {
      ...pkg,
      name: `@bemoje/${wsDirname}`,
      bin: './cli.mjs',
      files: ['cli.mjs', `${wsDirname}.cjs`, `${wsDirname}.cjs.map`],
      publishConfig: { access: 'public' },
      repository: { type: 'git', url: 'https://github.com/bemoje/mono.git', directory: `apps/${wsDirname}` },
      author: { name: 'Benjamin Moller Jensen', email: 'bemoje@bemoje.net', url: 'https://github.com/bemoje/' },
      license: 'MIT',
      scripts: [],
    },
    null,
    2
  )
)
