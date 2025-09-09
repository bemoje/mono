import { Command } from './Command'

// Create root command
const cmd = new Command('root')
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
