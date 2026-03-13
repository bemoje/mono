import enquirer from 'enquirer'
import fs from 'fs-extra'

const json = await fs.readFile('./package.json', 'utf-8')
const pkg = JSON.parse(json)
const keys = Object.keys(pkg.scripts || {})
const padLen = Math.max(
  ...keys.map((k) => {
    return k.length
  })
)
const run = pkg.yarn || pkg.packageManager?.includes('yarn') ? 'yarn' : 'npm run'
const choices = keys.map((name) => {
  const termWidth = process.stdout.columns
  const available = termWidth - padLen - 5
  const body = (pkg.scripts?.[name] ?? '') as string
  const padded = name.padEnd(padLen, ' ')
  let hint = padded.slice(name.length)
  if (body.length > available) {
    const arr = [] as string[]
    let current = ''
    body.split(' ').forEach((arg, i, elems) => {
      const newLength = current.length + 1 + arg.length
      const withArg = current ? `${current} ${arg}` : arg
      if (newLength > available) {
        // console.log(current, arg, newLength, available)
        arr.push(current)
        // current = `${''.padEnd(padLen + 3, ' ')}  ${arg}`
        current = arg
      } else {
        current = withArg
      }
      if (current && i === elems.length - 1) {
        arr.push(current)
      }
    })
    hint += arr
      .map((line, i) => {
        return i === 0 ? line : `${''.padEnd(padLen + 3, ' ')}${line}`
      })
      .join('\n')
  } else {
    hint += body
  }

  return { name, hint }
})

const selected = (
  (await enquirer.prompt({
    type: 'autocomplete',
    name: 'scripts',
    message: 'Select scripts to run',
    multiple: true,
    choices,
    align: 'left',
  })) as { scripts: string[] }
).scripts.map((name) => {
  return `${run} ${name}`
})

selected.forEach((cmd) => {
  console.log('>', cmd)
})

// import { search } from '@inquirer/prompts'

// const answer = await search({
//   message: 'Select an npm package',
//   source: async (input, { signal }) => {
//     return ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
//   },
// })

// console.log('Answer:', answer)
