import { buildLibsWorkspace } from '../../s/util/buildLibsWorkspace.mjs'

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  format: 'cjs',
})

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  format: 'esm',
})

import fs from 'fs-extra'
import path from 'upath'
import ts from 'typescript'
import strip from 'strip-comments'
import esbuild from 'esbuild'
import { getRepoRootDirpath } from '../../s/util/getRepoRootDirpath.mjs'

const REPO_ROOT = getRepoRootDirpath()
const pkg = await fs.readJson('./package.json')
const repoPkg = await fs.readJson(path.joinSafe(REPO_ROOT, 'package.json'))
const libName = pkg.name.split('/').pop()
const outDir = path.resolve('../../.dist/libs/' + libName)

const tsconfigBaseFilepath = '../../tsconfig.json'
const tsconfigBaseJson = strip(await fs.readFile(tsconfigBaseFilepath, 'utf8'))
const tsconfigBase = JSON.parse(tsconfigBaseJson)

await fs.remove(outDir)

ts.createProgram({
  rootNames: ['./src/index.ts'],

  options: {
    // project:'./tsconfig.json',
    ...tsconfigBase,
    verbatimModuleSyntax: true,
    isolatedDeclarations: true,
    declaration: true,
    isolatedModules: false,
    emitDeclarationOnly: true,
    declarationMap: true,
    sourceMap: true,
    outDir,
  },
}).emit()

// const entryPoints = fs
//   .readdirSync('./src', { recursive: true, withFileTypes: true })
//   .filter((dirent) => {
//     return (
//       dirent.isFile() &&
//       dirent.name.endsWith('.ts') &&
//       !dirent.name.endsWith('.test.ts') &&
//       !dirent.name.endsWith('.spec.ts')
//     )
//   })
//   .map((dirent) => path.join(dirent.parentPath, dirent.name))

// await esbuild.build({
//   entryPoints: entryPoints,
//   bundle: false,
//   outdir: outDir,
//   outbase: './src',
//   tsconfig: './tsconfig.json',
//   platform: 'node',
//   format: 'esm',
//   target: ['node20', 'es2022'],
//   treeShaking: true,
//   keepNames: true,
//   minify: false,
//   mainFields: ['main', 'module'],
//   sourcemap: true,
// })

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: path.joinSafe(outDir, 'index.js'),
  tsconfig: './tsconfig.json',
  platform: 'node',
  format: 'esm',
  target: ['node20', 'es2022'],
  external: [...Object.keys(repoPkg.dependencies || {}), ...Object.keys(repoPkg.devDependencies || {})],
  treeShaking: true,
  keepNames: true,
  minify: false,
  mainFields: ['main', 'module'],
  sourcemap: true,
})

// add '.js' to local file import statements
// import { glob } from 'glob'
// const outDirJsFiles = await glob('**/*.js', { cwd: outDir, absolute: true })
// const outDirJsFilenames = outDirJsFiles.map((fp) => path.parse(fp).name)
// outDirJsFiles.forEach((fp) => {
//   const code = fs.readFileSync(fp, 'utf8')
//   const lines = code.split('\n').map((line) => {
//     if (!line.endsWith(`";`)) return line
//     if (!line.includes(`from ".`)) return line
//     const isLocalJsFileImport = outDirJsFilenames.some((name) => {
//       return line.endsWith(`/${name}";`)
//     })
//     if (!isLocalJsFileImport) return line
//     return line.replace(/";$/, '.js";')
//   })
//   const newCode = lines.join('\n')
//   if (newCode !== code) {
//     fs.writeFileSync(fp, newCode, 'utf8')
//   }
// })

const localPackageName = pkg.name
const publicPackageName = pkg.name.replace('@mono', '@bemoje')

await fs.outputJson(
  outDir + '/package.json',
  {
    name: publicPackageName,
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
