import { execSync } from 'node:child_process'

export function cliExecSync(
  command: string,
  options: { dryRun?: boolean; quiet?: boolean; cwd?: string; silent?: boolean } = {},
) {
  if (options.dryRun) {
    if (!options.quiet) {
      console.log(`dryRun. Command skipped: ${command}`)
    }
    return
  }

  execSync(command, {
    stdio: options.quiet ? 'ignore' : 'inherit',
    cwd: options.cwd ?? process.cwd(),
  })
}
