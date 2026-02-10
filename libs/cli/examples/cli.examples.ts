import { Command, Option, findOption } from '../src'
import assert from 'node:assert'

export function help_option_enabled_by_default(): void {
  const cmd = new Command('app')

  // All option instances are stored in options array
  const optionsArray = cmd.options

  // There should be a help Option instance by default
  const helpOption = findOption(cmd, 'help')

  // Render help text
  const helpText = cmd.renderHelp({ noColor: true })

  // assertions
  assert.ok(helpOption instanceof Option)
  assert.ok(optionsArray.includes(helpOption!))
  assert.match(helpText, /-h, --help/)
}

// help_option_enabled_by_default()

export function subcommands(): void {
  // Create root command
  const cmd = new Command('cli')
    .setVersion('1.0.0')
    .setDescription('Root command')
    .addArgument('<input>', '', {})
    .addArgument('[output]', '', { defaultValue: 'out.txt' })
    .addArgument('<str...>')
    .addOption('-f, --file-path [path...]')
    .addOption('-v, --verbose', '', { env: 'VERBOSE' })

  // Add a subcommand
  const subcmd = cmd
    .command('list', {
      // decide which options to inherit
      inheritOptionsExcept: ['filePath'],
    })
    .setDescription('Display list')
    .addAliases('ls')
    .addOption('-a, --all')

  // Parse argv
  console.log(cmd.parseArgv(['in.txt', '--verbose', '--file-path', 'cfg', 'config.json', '-h']))
  console.log('------------')

  // render help
  console.log(cmd.renderHelp({ noColor: false }))
  console.log('------------')

  console.log(cmd.parseArgv(['list', '--no-verbose', '--number', '42']))
  console.log('------------')

  console.log(subcmd.renderHelp({ noColor: false }))
  console.log('------------')
}
