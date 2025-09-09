/**
 * Runner utility that compiles and executes files in the workspace.
 * Supports: (.ts, .test.ts, .js, .ps1, .mjs)
 * For TS files, automatically adds source map support and pretty stack traces for better debugging.
 * Used by the `yarn run` command to run .ts files without needing to build them first.
 */
import cp from 'node:child_process'
import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import path from 'upath'
import { getRepoRootDirpath } from './util/getRepoRootDirpath.mjs'

const arg0 = process.argv[2]
const relative = path.isAbsolute(arg0) ? path.relative(getRepoRootDirpath(), arg0) : path.normalizeSafe(arg0)

if (!arg0) {
  console.error('no filepath argument provided')
  process.exit(1)
}

if (arg0.endsWith('.test.ts')) {
  cp.execSync(`yarn vitest --config vitest.config.js --run ${relative}`, {
    stdio: 'inherit',
    cwd: getRepoRootDirpath(),
  })
  process.exit(0)
}

if (arg0.endsWith('.mjs') | arg0.endsWith('.cjs') | arg0.endsWith('.js')) {
  cp.execSync(`node ${relative}`, {
    stdio: 'inherit',
    cwd: getRepoRootDirpath(),
  })
  process.exit(0)
}

if (arg0.endsWith('.ps1')) {
  cp.execSync(`./${relative}`, {
    stdio: 'inherit',
    cwd: getRepoRootDirpath(),
  })
  process.exit(0)
}

if (!arg0.endsWith('.ts')) {
  console.error('Cannot run this file type:', arg0)
  process.exit(1)
}

const importSourceMapLine = `import 'source-map-support/register'`
const importPrettyStackTraceLine = `import { enablePrettyStackTrace } from '@mono/stacktrace';\nenablePrettyStackTrace()`

const repoPkg = fs.readJsonSync('package.json')
const wsPath = relative.split(/\\|\//).slice(0, 2).join('/')
const wsTsconfigPath = path.join(wsPath, 'tsconfig.json')
const wsPkg = fs.readJsonSync(path.join(wsPath, 'package.json'))

const wsName = wsPkg.name.split(/\\|\//).pop()
const cjsBasename = path.basename(relative).replace('.ts', '.cjs')
const outfile = `.dist/temp/runner.cjs`

const tscodeOriginal = fs.readFileSync(relative, 'utf8')
let tscode = tscodeOriginal

if (process.argv.slice(2).includes('--debug')) {
  console.log({
    arg0,
    relative,
    wsPath,
    wsTsconfigPath,
    wsName,
    cjsBasename,
    outfile,
    importSourceMapLine,
    tscode,
  })
}

let changedSourceFile = false

try {
  if (!tscode.includes(importSourceMapLine)) {
    changedSourceFile = true
    tscode = importSourceMapLine + '\n' + tscode
  }

  if (!tscode.includes(importPrettyStackTraceLine)) {
    changedSourceFile = true
    tscode = importPrettyStackTraceLine + '\n' + tscode
  }

  if (changedSourceFile) {
    fs.writeFileSync(relative, tscode)
  }

  await esbuild.build({
    entryPoints: [relative],
    bundle: true,
    outfile: outfile,
    tsconfig: wsTsconfigPath,
    platform: 'node',
    format: 'cjs',
    target: ['node20'],
    external: [...Object.keys(repoPkg.dependencies || {}), ...Object.keys(repoPkg.devDependencies || {})],
    keepNames: true,
    minify: false,
    mainFields: ['module', 'main'],
    sourcemap: true,
  })
} finally {
  if (changedSourceFile) {
    fs.writeFileSync(relative, tscodeOriginal)
  }
}

cp.spawn('node', [outfile, ...process.argv.slice(3)], {
  stdio: 'inherit',
  cwd: getRepoRootDirpath(),
})
