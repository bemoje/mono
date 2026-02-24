import cp from 'node:child_process'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from '../lib/getRepoRootDirpath'

export async function runAction(filepath: string, args: string[]) {
  const root = getRepoRootDirpath()
  const relative = upath.isAbsolute(filepath) ? upath.relative(root, filepath) : upath.normalizeSafe(filepath)

  if (!filepath) {
    console.error('no filepath argument provided')
    process.exit(1)
  }

  if (filepath.endsWith('.test.ts')) {
    cp.execSync(`yarn vitest --config vitest.config.js --run ${relative}`, {
      stdio: 'inherit',
      cwd: root,
    })
    process.exit(0)
  }

  if (filepath.endsWith('.mjs') || filepath.endsWith('.cjs') || filepath.endsWith('.js')) {
    cp.execSync(`node ${relative}`, {
      stdio: 'inherit',
      cwd: root,
    })
    process.exit(0)
  }

  if (filepath.endsWith('.ps1')) {
    cp.execSync(`./${relative}`, {
      stdio: 'inherit',
      cwd: root,
    })
    process.exit(0)
  }

  if (!filepath.endsWith('.ts')) {
    console.error('Cannot run this file type:', filepath)
    process.exit(1)
  }

  const importSourceMapLine = `import 'source-map-support/register'`
  const importPrettyStackTraceLine = `import { enablePrettyStackTrace } from '@mono/stacktrace';\nenablePrettyStackTrace()`

  const tscodeOriginal = fs.readFileSync(relative, 'utf8')
  let tscode = tscodeOriginal
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
      // fs.writeFileSync(relative, tscode)
    }

    const requires = [
      'tsconfig-paths/register',
      'dotenv/config',
      'source-map-support/register',
      `./scripts/enablePrettyStackTrace.cjs`,
    ]
      .map((r) => `-r ${r}`)
      .join(' ')

    cp.execSync(`tsx ${requires} ${relative} ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: root,
    })
  } finally {
    if (changedSourceFile) {
      // fs.writeFileSync(relative, tscodeOriginal)
    }
  }
}
