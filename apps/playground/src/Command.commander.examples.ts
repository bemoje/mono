import { Command } from 'commander'
import { CommanderHelpAdapter } from '@mono/cli'

const cmd = new Command('myapp')
  .helpCommand(false)
  .helpOption(false)
  .version('1.0.0')
  .description('A test application')
  .argument('<input>', 'input file')
  .argument('[output]', 'output file', 'out.txt')
  .option('-v, --verbose', 'verbose output')
  .option('-f, --format <type>', 'output format')

cmd.command('sub').description('A subcommand')

console.log(new CommanderHelpAdapter(cmd).renderHelp())
