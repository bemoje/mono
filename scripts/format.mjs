/** @format */

import { chunk } from 'es-toolkit/array'
import cp from 'child_process'
import fs from 'fs'

const args = process.argv.slice(2)

if (
  !args.some((arg) => {
    return ['--check', '--write', '-c', '-w'].includes(arg)
  })
) {
  console.error(
    `Error: You must provide either --check or --write (or their short versions -c or -w) as an argument.`,
  )
  process.exit(1)
}

const cmd = [
  //
  `git diff --cached --name-only`,
  `git diff --name-only`,
  `git ls-files --others --exclude-standard`,
].join(' && ')

const files = cp
  .execSync(cmd, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .map((f) => {
    return f.trim()
  })
  .filter(Boolean)
const existentFiles = Array.from(new Set(files))
  .flat()
  .filter((file) => {
    return !file.startsWith('.dist/')
  })
  .filter((file) => {
    return !file.includes('/dist/')
  })
  .filter((file) => {
    return fs.existsSync(file)
  })
  .filter((file) => {
    return fs.statSync(file).isFile()
  })

if (existentFiles.length === 0) {
  console.log('No files to format.')
  process.exit(0)
}

for (const files of chunk(existentFiles, 20)) {
  const prettierCmd = `yarn prettier ${args.join(' ')} --ignore-unknown ${files.join(' ')}`
  // console.debug(`Running: ${prettierCmd}`)
  cp.execSync(prettierCmd, { stdio: 'inherit' })
}
