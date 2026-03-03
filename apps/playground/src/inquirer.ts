import type { CheckboxPlusChoice } from 'inquirer-checkbox-plus-plus'
import checkboxPlus from 'inquirer-checkbox-plus-plus'
import fs from 'fs-extra'

const json = await fs.readFile('./package.json', 'utf-8')
const pkg = JSON.parse(json)

const keys = Object.keys(pkg.scripts || {})
const padLen =
  Math.max(
    ...keys.map((k) => {
      return k.length
    })
  ) + 2

const run = pkg.yarn || pkg.packageManager?.includes('yarn') ? 'yarn' : 'npm run'

const termWidth = process.stdout.columns

const available = termWidth - padLen - 5

const choices = keys.map((name) => {
  const body = (pkg.scripts?.[name] ?? '') as string
  const padded = name.padEnd(padLen, ' ').slice(name.length)
  let hint = padded
  if (body.length > available) {
    const arr = [] as string[]
    let current = ''
    body.split(' ').forEach((arg, i, elems) => {
      const newLength = current.length + 1 + arg.length
      const withArg = `${current} ${arg}`
      if (newLength > available) {
        arr.push(current)
        current = `${''.padEnd(padLen + 3, ' ')}  ${arg}`
      } else {
        current = withArg
      }
      if (current && i === elems.length - 1) {
        arr.push(current)
      }
    })
    hint += arr.join('\n').slice(1)
  } else {
    hint += body
  }

  return {
    name,
    value: name,
    // value: '',
    // message: name,
    // message: `${colors.gray(run)} ${name}`,

    description: hint,
  } as CheckboxPlusChoice
})

const answers = await checkboxPlus({
  highlight: true,
  message: 'Select scripts to run',
  searchable: true,
  pageSize: 50,
  source: async (_, input) => {
    return choices.filter((c) => {
      return c.name.includes(input) || c.checked
    })
  },
})

console.log('Answer:', answers)
