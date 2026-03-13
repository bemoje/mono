import type { AutocompleteMultiselectPrompt } from '../lib/AutocompleteMultiselectPrompt'
import { spawnChildProcess } from '@mono/node'
import { spawnNodeProcess } from '@mono/node'

export async function onCancel(prompt: AutocompleteMultiselectPrompt<string>) {
  if (prompt.userInput?.trim()) {
    const filepath = process.argv[1]
    const spawnArgs = [filepath, ...process.argv.slice(2)]
    const env = { ...process.env, INITIAL_VALUES: prompt.selectedValues.join(',') }

    const exitCode = filepath.endsWith('.ts')
      ? await spawnChildProcess('tsx', spawnArgs, { stdio: 'inherit', env, shell: true }).catch(() => {
          return 1
        })
      : await spawnNodeProcess(spawnArgs, { stdio: 'inherit', env }).catch(() => {
          return 1
        })

    process.exitCode = process.exitCode || exitCode
    process.exit(process.exitCode)
  } else {
    process.exit(0)
  }
}
