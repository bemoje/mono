import colors from 'ansi-colors'
import { confirm } from '@clack/prompts'
import { spawnChildProcess } from '@mono/node'

export async function executeScripts(selections: string[], pkgManRun: string) {
  const formattedArgs = process.argv.slice(2).map((arg) => {
    return arg.startsWith('-') ? arg : `'${arg}'`
  })

  const confirmed = await confirm({
    message: [
      selections.length > 1 ? `Run all of the below commands?` : `Run the below command?`,
      ...selections.map((selection) => {
        return ['    ', pkgManRun, colors.green(selection), ...formattedArgs].join(' ')
      }), //
    ].join('\n'),
    initialValue: true,
  })

  if (confirmed === true) {
    for (const selection of selections) {
      console.log()
      console.log('>>', colors.magenta([pkgManRun, selection, ...formattedArgs].join(' ')))

      const spawnArgs = [...pkgManRun.split(' '), selection, ...process.argv.slice(2)]
        .map((arg) => {
          return arg.trim()
        })
        .filter(Boolean)
      const program = spawnArgs.shift()!

      const exitCode = await spawnChildProcess(program, spawnArgs, {
        stdio: 'inherit', //
        shell: true,
      }).catch(() => {
        return 1
      })

      process.exitCode = process.exitCode || exitCode

      if (process.exitCode) {
        break
      }
    }
  }
}
