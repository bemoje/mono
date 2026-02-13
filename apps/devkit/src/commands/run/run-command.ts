import { Command } from 'commander'
import cp from 'node:child_process'
import * as esbuild from 'esbuild'
import fs from 'fs-extra'
import upath from 'upath'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'

export function runCommand() {
  return new Command('run')
    .alias('r')
    .description('Compile and run a file. Supports .ts, .test.ts, .js, .mjs, .cjs, .ps1')
    .argument('<filepath>', 'Path to file to run')
    .argument('[args...]', 'Additional arguments to pass to the script')
    .allowUnknownOption(true)
    .action(async (filepath: string, args: string[]) => {
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

      const wsPath = relative.split(/\\|\//).slice(0, 2).join('/')
      const wsTsconfigPath = upath.join(wsPath, 'tsconfig.json')
      const outfile = `.dist/temp/runner.cjs`

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
          fs.writeFileSync(relative, tscode)
        }

        await esbuild.build({
          entryPoints: [relative],
          bundle: true,
          outfile,
          tsconfig: wsTsconfigPath,
          platform: 'node',
          format: 'cjs',
          target: ['node20'],
          external: ['type-fest'],
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

      cp.spawn('node', [outfile, ...args], {
        stdio: 'inherit',
        cwd: root,
      })
    })
}
