import { Command, Help } from '@mono/cli'

const cmd = new Command('myapp')
  .setVersion('1.0.0')
  .setDescription('A test application', 'another line')
  .argument('<input>', 'input file')
  .argument('[output]', 'output file', { defaultValue: 'out.txt' })
  .option('-v, --verbose', 'verbose output', { group: 'Output Options' })
  .option('-f, --format <type>', 'output format', {
    env: 'MYAPP_FORMAT',
    choices: ['json', 'xml'],
    group: 'Output Options',
  })
  .option('-h, --help', 'display help')

cmd.subcommand('sub').setDescription('A subcommand')

/////////////

const parsedRoot = cmd.parse(['input.txt', '--no-verbose', '--format', 'json'])
console.log(parsedRoot)
console.log('--------------')
console.log(parsedRoot.command.renderHelp(new Help()))

console.log('------------------------------------------')

const parsedSub = cmd.parse(['sub', '-h'])
console.log(parsedSub)
console.log('--------------')
console.log(parsedSub.command.renderHelp(new Help()))
