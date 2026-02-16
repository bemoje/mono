import cp from 'child_process'
import fs from 'fs'

const args = process.argv.slice(2)

if (!args.some((arg) => ['--check', '--write', '-c', '-w'].includes(arg))) {
  console.error(
    `Error: You must provide either --check or --write (or their short versions -c or -w) as an argument.`,
  )
  process.exit(1)
}

async function exec(cmd) {
  return cp
    .execSync(cmd, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
}

const commands = [
  `git diff --cached --name-only`, //
  `git diff --name-only`,
  `git ls-files --others --exclude-standard`,
]

const files = Array.from(new Set((await Promise.all(commands.map(exec))).flat()))
const existentFiles = files.filter((file) => {
  return fs.existsSync(file)
})

if (existentFiles.length === 0) {
  console.log('No files to format.')
  process.exit(0)
}

const prettierCmd = `yarn prettier ${args.join(' ')} ${existentFiles.join(' ')}`

console.debug(`Running: ${prettierCmd}`)
cp.execSync(prettierCmd, { stdio: 'inherit' })
