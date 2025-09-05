import { Command, CommandHelpDefinition } from '@mono/node'

const cmd = new Command('myapp', '1.0.0', 'A test application')
  .argument('<input>', 'input file')
  .argument('[output]', 'output file', { defaultValue: 'out.txt' })
  .option('-v, --verbose', 'verbose output', { group: 'Output Options' })
  .option('-f, --format <type>', 'output format', { env: 'MYAPP_FORMAT' })
  .option('-h, --help', 'display help')
cmd.command('sub', 'A sub command')

// console.log(cmd)
// console.log('--------------')
// const parsed = cmd.parse(['sub', '-h'])
const parsed = cmd.parse(['input.txt', '--verbose', '--format', 'json'])
console.log(parsed)

console.log('--------------')
console.log(parsed.command.renderHelp(new CommandHelpDefinition()))
