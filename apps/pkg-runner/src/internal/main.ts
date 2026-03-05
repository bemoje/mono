import { AutocompleteMultiselectPrompt } from '../lib/AutocompleteMultiselectPrompt'
import type { Option } from '@clack/prompts'
import { clearTerminal } from '../util/clearTerminal'
import colors from 'ansi-colors'
import { createFilterMemoized } from './createFilterMemoized'
import { createHints } from './createHints'
import { executeScripts } from './executeScripts'
import fs from 'fs-extra'
import { isCancel } from '@clack/prompts'
import { onCancel } from './onCancel'

export async function main() {
  clearTerminal()

  process.argv = process.argv.filter((arg) => {
    return !!arg.trim()
  })

  if (!fs.existsSync('package.json')) {
    console.error('No package.json found in the current directory')
    process.exit(1)
  }
  const json = fs.readFileSync('package.json', 'utf-8')
  const pkg = JSON.parse(json)
  const scripts = (pkg.scripts || {}) as Record<string, string>
  const names = Object.keys(scripts) as unknown as (keyof typeof scripts)[]
  const pkgManRun = pkg.yarn || pkg.packageManager?.includes('yarn') ? 'yarn' : 'npm run'
  const hints = createHints(names, scripts)
  const filterMemoized = createFilterMemoized(names)

  const prompt = new AutocompleteMultiselectPrompt<string>({
    message: 'Select scripts to run',
    initialValues: process.env.INITIAL_VALUES?.split(','),
    placeholder: 'Type to search...',
    maxItems: process.stdout.rows ? Math.max(process.stdout.rows - 5, 5) : 50,
    withGuide: true,
    required: true,
    options() {
      return names.map((name) => {
        const option = {
          value: name,
          label: name, //
          hint: hints.get(name) ?? '',
        }
        return Object.defineProperty(option, 'selected', {
          get: () => {
            return this.selectedValues.includes(name)
          },
        })
      })
    },
    filter(search, _option) {
      const option = _option as Option<string> & { get selected(): boolean }
      if (option.selected) {
        option.label = colors.green(option.value)
        return true
      }
      const { result, label } = filterMemoized(
        search,
        option.value //
      )
      option.label = label
      return result
    },
  })

  prompt.on('key', (_, key) => {
    if (key.ctrl && key.name === 'c') {
      process.emit('SIGINT')
    }
  })

  const selections = await prompt.start()

  await (isCancel(selections) ? onCancel(prompt) : executeScripts(selections, pkgManRun));
}
