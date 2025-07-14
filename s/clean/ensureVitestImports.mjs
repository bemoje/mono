import { execSync } from 'child_process'
import fs from 'fs-extra'
import { globSync } from 'glob'
import path from 'upath'
import { confirmPrompt } from '../../.dist/terminal.cjs'

export async function ensureVitestImports() {
  console.log('Fixing Vitest imports in test files...')

  //
  const fileGlob = process.argv[2] ?? '{libs,apps,packages}/*/src/**/*.{test,spec}.{ts,tsx}'

  //
  let filepaths = globSync(fileGlob, { cwd: process.cwd() }) //
    .map((filepath) => path.normalizeSafe(filepath))

  console.log(`Found ${filepaths.length} files matching glob: ${fileGlob}`)
  if (filepaths.length === 0) return

  //
  const ignored = []
  filepaths = filepaths
    .map((filepath) => {
      const code = fs.readFileSync(filepath, 'utf-8')
      return { filepath, code }
    })
    .filter((o) => {
      const isEmpty = !o.code.trim()
      const isIgnore = isEmpty || o.code.includes(`from 'vitest'`)
      if (isIgnore) ignored.push(o.filepath)
      return !isIgnore
    })

  filepaths.map((o) => o.filepath).forEach((f) => console.log(f))
  console.log(`Found ${filepaths.length} files missing vitest import`)

  if (filepaths.length === 0) return

  //

  // confirm if multiple files are found
  if (filepaths.length > 1) {
    const isConfirmed = await confirmPrompt(`Are you sure you want to add Vitest imports to these files? (y/n)`)
    if (!isConfirmed) {
      console.log('Aborting...')
      return
    }
  }

  //
  filepaths.map((o) => {
    const importLine = `import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test, vitest, vi } from 'vitest'`
    fs.outputFileSync(o.filepath, `${importLine}\n\n${o.code}`, 'utf-8')
    console.log(`Added Vitest imports to: ${o.filepath}`)
  })
}
