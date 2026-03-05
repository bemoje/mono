import * as esbuild from 'esbuild'
import fs from 'fs-extra'
/**
 * Self-contained build script.
 * This file must NOT import from s/ or any workspace - it is the bootstrap entry point.
 */
import upath from 'upath'

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const wsDirname = upath.basename(wsDirpath)

const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const indexFilepath = upath.joinSafe(wsDirpath, 'src', 'main.ts')

const distDirpath = upath.joinSafe(wsDirpath, 'dist')
const indexOutFilepath = upath.joinSafe(distDirpath, `${wsDirname}.cjs`)

const packageJsonFilepath = upath.joinSafe(wsDirpath, 'package.json')
const pkg = await fs.readJson(packageJsonFilepath)

// const rootPkg = await fs.readJson(upath.joinSafe(repoRootDirpath, 'package.json'))

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
  keepNames: false,
  mainFields: ['module', 'main'],
  treeShaking: true,

  external: Object.keys(pkg.dependencies || {}).filter((name) => {
    return !name.startsWith('@node/')
  }),
  banner: { js: '#!/usr/bin/env node' },
  logOverride: { 'empty-import-meta': 'silent' },
})

// create bin wrapper for cross-platform npx support
await fs.outputFile(upath.joinSafe(distDirpath, 'cli.mjs'), `#!/usr/bin/env node\nimport("./${wsDirname}.cjs");\n`)

await fs.outputFile(
  upath.joinSafe(distDirpath, 'package.json'),
  JSON.stringify(
    {
      ...pkg,
      name: pkg.name,
      bin: './cli.mjs',
      files: ['cli.mjs', `${wsDirname}.cjs`],
      publishConfig: { access: 'public' },
      repository: { type: 'git', url: 'https://github.com/bemoje/mono.git', directory: `apps/${wsDirname}` },
      author: { name: 'Benjamin Moller Jensen', email: 'bemoje@bemoje.net', url: 'https://github.com/bemoje/' },
      license: 'MIT',
      scripts: undefined,
      dependencies: { ...pkg.dependencies },
    },
    null,
    2
  )
)

await fs.copyFile(upath.joinSafe(wsDirpath, 'README.md'), upath.joinSafe(distDirpath, 'README.md'))
