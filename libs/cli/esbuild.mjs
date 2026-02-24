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

const external = [
  '@sinclair/typebox',
  'ansi-colors',
  'cli-table',
  'enhanced-ms',
  'es-toolkit',
  'es-toolkit/*',
  'humanize-duration',
  'iter-tools',
  'memoizee',
  'mnemonist',
  'onetime',
  'p-queue',
  'type-fest',
  'upath',
]

// clean dist
await fs.remove(distDir)
await fs.ensureDir(distDir)

// build ESM bundle with esbuild
await esbuild.build({
  entryPoints: [entryPoint],
  bundle: true,
  outfile,
  tsconfig: tsconfigFilepath,
  platform: 'node',
  format: 'esm',
  target: ['es2022'],
  minify: false,
  keepNames: true,
  sourcemap: true,
  treeShaking: true,
  external,
})

// generate type declarations (ignore exit code - sibling workspace index.ts barrels may have type errors)
try {
  cp.execSync('npx tsc --project tsconfig.build.json', { cwd: wsDirpath, stdio: 'inherit' })
} catch {
  // tsc may report errors in sibling workspaces but still emits declarations
}

// tsc emits to dist/libs/cli/src/ because rootDir is monorepo root - flatten to dist/
const tscOutDir = upath.joinSafe(distDir, 'libs', 'cli', 'src')
if (await fs.pathExists(tscOutDir)) {
  await fs.copy(tscOutDir, distDir, { overwrite: true })
  await fs.remove(upath.joinSafe(distDir, 'libs'))
}

// write publish-ready package.json into dist/
const rootPkg = await fs.readJson(upath.joinSafe(wsDirpath, '..', '..', 'package.json'))
const pkg = await fs.readJson(upath.joinSafe(wsDirpath, 'package.json'))

function depVersion(name) {
  return rootPkg.dependencies[name] || rootPkg.devDependencies[name]
}

await fs.writeJson(
  upath.joinSafe(distDir, 'package.json'),
  {
    name: '@bemoje/cli',
    version: pkg.version,
    description: pkg.description,
    type: 'module',
    sideEffects: false,
    keywords: pkg.keywords,
    exports: {
      '.': {
        types: './index.d.ts',
        import: './index.mjs',
        default: './index.mjs',
      },
    },
    dependencies: {
      '@sinclair/typebox': depVersion('@sinclair/typebox'),
      'ansi-colors': depVersion('ansi-colors'),
      'cli-table': depVersion('cli-table'),
      'enhanced-ms': depVersion('enhanced-ms'),
      'es-toolkit': depVersion('es-toolkit'),
      'humanize-duration': depVersion('humanize-duration'),
      'iter-tools': depVersion('iter-tools'),
      'memoizee': depVersion('memoizee'),
      'mnemonist': depVersion('mnemonist'),
      'onetime': depVersion('onetime'),
      'p-queue': depVersion('p-queue'),
      'upath': depVersion('upath'),
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
      directory: 'libs/cli',
    },
  },
  { spaces: 2 },
)

console.info('Build complete: ' + distDir)
