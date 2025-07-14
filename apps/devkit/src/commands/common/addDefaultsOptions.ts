import { Command, Option } from 'commander'

export function addDefaultsOptions(cmd: Command) {
  cmd.addOption(new Option('-y, --yes', 'Skip confirmation.'))
  cmd.addOption(new Option('-d, --dryRun', 'Dry run. No changes made.'))
  cmd.addOption(new Option('-q, --quiet', 'Omit output from package manager.'))
  cmd.addOption(new Option('-D, --debug', 'Output debugging information.'))
  cmd.addOption(new Option('-s, --silent', 'No output.').implies({ yes: true, quiet: true, debug: false }))
}

export interface DefaultOptions {
  yes?: boolean
  dryRun?: boolean
  quiet?: boolean
  silent?: boolean
  debug?: boolean
}
