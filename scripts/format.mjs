import cp from 'child_process'

function exec(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).trim()
}

const files = [] //
  .concat(
    exec(`git diff --cached --name-only`)
      .split('\n')
      .filter((f) => f.trim() !== ''),
  )
  .concat(
    exec(`git diff --name-only`)
      .split('\n')
      .filter((f) => f.trim() !== ''),
  )
  .concat(
    exec(`git ls-files --others --exclude-standard`)
      .split('\n')
      .filter((f) => f.trim() !== ''),
  )
if (files.length === 0) {
  console.log('No files to format.')
  process.exit(0)
}
const prettierCmd = `yarn prettier --ignore-unknown --write ${files.map((f) => `${f}`).join(' ')}`
console.log(`Running: ${prettierCmd}`)
cp.execSync(prettierCmd, { stdio: 'inherit' })
