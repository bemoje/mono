import { buildLibsWorkspace } from '../../s/util/buildLibsWorkspace.mjs'

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  external: ['commander'],
  format: 'cjs',
})

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  external: ['commander'],
  format: 'esm',
})

import fs from 'fs-extra'
import path from 'upath'
import * as ts from 'typescript'
import strip from 'strip-comments'
import esbuild from 'esbuild'
import { getRepoRootDirpath } from '../../s/util/getRepoRootDirpath.mjs'
import { glob } from 'glob'

const REPO_ROOT = getRepoRootDirpath()
const pkg = fs.readJsonSync('./package.json')
const repoPkg = fs.readJsonSync(path.joinSafe(REPO_ROOT, 'package.json'))
const libName = pkg.name.split('/').pop()
const outDir = path.resolve('../../.dist/libs/' + libName)

const tsconfigBaseFilepath = '../../tsconfig.json'
const tsconfigBaseJson = strip(fs.readFileSync(tsconfigBaseFilepath, 'utf8'))
const tsconfigBase = JSON.parse(tsconfigBaseJson)

const entryPoints = fs
  .readdirSync('./src', { recursive: true, withFileTypes: true })
  .filter((dirent) => {
    return (
      dirent.isFile() &&
      dirent.name.endsWith('.ts') &&
      !dirent.name.endsWith('.test.ts') &&
      !dirent.name.endsWith('.spec.ts')
    )
  })
  .map((dirent) => path.join(dirent.parentPath, dirent.name))

fs.removeSync(outDir)

ts.createProgram({
  rootNames: ['./src/index.ts'],
  options: {
    ...tsconfigBase,
    emitDeclarationOnly: true,
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    outDir,
  },
}).emit()

await esbuild.build({
  entryPoints: entryPoints,
  bundle: false,
  outdir: outDir,
  tsconfig: './tsconfig.json',
  platform: 'node',
  format: 'esm',
  // external: ['vitest'],
  target: ['node20', 'es2022'],
  treeShaking: true,
  keepNames: true,
  minify: false,
  mainFields: ['main', 'module'],
  sourcemap: true,
})

const outDirJsFiles = await glob('**/*.js', { cwd: outDir })
const outDirJsFilenames = outDirJsFiles.map((fp) => path.parse(fp).name)
outDirJsFiles.forEach((fp) => {
  const code = fs.readFileSync(fp, 'utf8')
  const lines = code.split('\n').map((line) => {
    if (!line.endsWith(`";`)) return line
    if (!line.includes(`from ".`)) return line
    const isLocalJsFileImport = outDirJsFilenames.some((name) => {
      return line.endsWith(`/${name}";`)
    })
    if (!isLocalJsFileImport) return line
    return line.replace(/";$/, '.js";')
  })
  const newCode = lines.join('\n')
  if (newCode !== code) {
    fs.writeFileSync(fp, newCode, 'utf8')
  }
})

const localPackageName = pkg.name
const publicPackageName = pkg.name.replace('@mono', '@bemoje')

await fs.outputJson(
  outDir + '/package.json',
  {
    name: pkg.name.replace('@mono', '@bemoje'),
    description: pkg.description,
    version: pkg.version,
    private: false,
    sideEffects: pkg.sideEffects,
    type: 'module',
    module: './index.js',
    main: './index.js',
    exports: {
      '.': './index.js',
      './*': './lib/*.js',
      './package.json': './package.json',
      './index.d.ts': './index.d.ts',
    },
    typings: './index.d.ts',
    dependencies: pkg.dependencies ?? {},
    devDependencies: pkg.devDependencies ?? {},
    license: repoPkg.license,
    repository: repoPkg.repository,
    keywords: (pkg.keywords ?? []).concat('bemoje', libName),
    author: repoPkg.author,
    homepage: 'https://github.com/bemoje/mono/tree/main/libs/' + libName,
  },
  { spaces: 2 },
)

await fs.outputFile(
  path.joinSafe(outDir, 'README.md'),
  (await fs.readFile('./README.md', 'utf8')).replaceAll(localPackageName, publicPackageName),
)

await fs.copyFile(
  path.joinSafe(REPO_ROOT, 'LICENSE'), //
  path.joinSafe(outDir, 'LICENSE'),
)

await fs.outputFile(
  path.joinSafe(outDir, '.npmignore'),
  [
    '**/*.map', //
    '',
  ].join('\n'),
)
