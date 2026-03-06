import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import upath from 'upath'

/**
 * Self-contained build script.
 * This file must NOT import from s/ or any workspace - it is the bootstrap entry point.
 */

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)

const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')

const distDir = upath.joinSafe(wsDirpath, 'dist')
const indexOutFilepath = upath.joinSafe(distDir, `${wsDirname}.cjs`)

const packageJsonFilepath = upath.joinSafe(wsDirpath, 'package.json')
const pkg = await fs.readJson(packageJsonFilepath)

const rootPkg = await fs.readJson(upath.joinSafe(wsDirpath, '..', '..', 'package.json'))

const external = Object.keys(pkg.dependencies || {})
  .concat(
    Object.keys(pkg.dependencies || {}).map((s) => {
      return `${s}/*`
    })
  )
  .filter((name) => {
    return !name.startsWith('@node/')
  })

// build with esbuild
await esbuild.build({
  entryPoints: [indexFilepath],
  bundle: true,
  outfile: indexOutFilepath,
  tsconfig: tsconfigFilepath,
  platform: 'node',
  format: 'cjs',
  target: ['node20', 'esnext'],
  minify: false,
  mainFields: ['module', 'main'],
  treeShaking: true,
  external,
  banner: { js: '#!/usr/bin/env node' },
  logOverride: { 'empty-import-meta': 'silent' },
})

// create bin wrapper for cross-platform npx support
await fs.outputFile(
  upath.joinSafe(distDir, `${wsDirname}.mjs`),
  `#!/usr/bin/env node\nimport("./${wsDirname}.cjs");\n`
)

await fs.outputFile(
  upath.joinSafe(distDir, 'package.json'),
  JSON.stringify(
    {
      ...pkg,
      bin: `./${wsDirname}.mjs`,
      files: [`${wsDirname}.mjs`, `${wsDirname}.cjs`],
      publishConfig: { access: 'public' },
      scripts: undefined,
      license: rootPkg.license,
      author: rootPkg.author,
      repository: { ...rootPkg.repository, directory: `libs/${wsDirname}` },
    },
    null,
    2
  )
)

await fs.copyFile(upath.joinSafe(wsDirpath, 'README.md'), upath.joinSafe(distDir, 'README.md'))
