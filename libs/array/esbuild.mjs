import upath from 'upath'
import fs from 'fs-extra'
import * as esbuild from 'esbuild'
import cp from 'node:child_process'

const wsDirpath = upath.normalizeSafe(import.meta.dirname)
const tsconfigFilepath = upath.joinSafe(wsDirpath, 'tsconfig.json')
const srcDir = upath.joinSafe(wsDirpath, 'src')
const distDir = upath.joinSafe(wsDirpath, 'dist')
const entryPoint = upath.joinSafe(srcDir, 'index.ts')
const outfile = upath.joinSafe(distDir, 'index.mjs')

// clean dist
await fs.remove(distDir)
await fs.ensureDir(distDir)

// build ESM bundle with esbuild
await esbuild.build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile,
  tsconfig: tsconfigFilepath,
  platform: 'neutral',
  format: 'esm',
  target: ['es2022'],
  minify: false,
  keepNames: true,
  sourcemap: true,
  treeShaking: true,
})

// generate type declarations
cp.execSync('npx tsc --project tsconfig.build.json', { cwd: wsDirpath, stdio: 'inherit' })

// write publish-ready package.json into dist/
const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))
await fs.writeJson(
  upath.joinSafe(distDir, 'package.json'),
  {
    name: '@bemoje/array',
    version: pkg.version,
    type: 'module',
    sideEffects: false,
    exports: {
      '.': {
        types: './index.d.ts',
        import: './index.mjs',
        default: './index.mjs',
      },
    },
    publishConfig: { access: 'public' },
    license: 'MIT',
    author: {
      name: 'Benjamin Moller Jensen',
      email: 'bemoje@bemoje.net',
      url: 'https://github.com/bemoje/',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/bemoje/mono.git',
      directory: 'libs/array',
    },
  },
  { spaces: 2 },
)

console.info('Build complete: ' + distDir)
