import { exec, execSync } from 'child_process'

export function cliExec(
  command: string,
  options: { dryRun?: boolean; quiet?: boolean; cwd?: string; silent?: boolean } = {},
) {
  return new Promise((resolve, reject) => {
    if (options.dryRun) {
      if (!options.quiet) {
        console.log('dryRun. Command skipped: ' + command)
      }
      return
    }

    const child = exec(command)
    if (!options.silent) {
      child.stderr?.pipe(process.stdout)
    }
    if (!options.quiet) {
      child.stdout?.pipe(process.stdout)
    }
    child.on('exit', (code) => {
      resolve(code)
    })
    child.on('error', (error) => {
      reject(error)
    })
  })
}

export function cliExecSync(
  command: string,
  options: { dryRun?: boolean; quiet?: boolean; cwd?: string; silent?: boolean } = {},
) {
  if (options.dryRun) {
    if (!options.quiet) {
      console.log('dryRun. Command skipped: ' + command)
    }
    return
  }

  execSync(command, {
    stdio: options.quiet ? 'ignore' : 'inherit',
    cwd: options.cwd ?? process.cwd(),
  })
}
