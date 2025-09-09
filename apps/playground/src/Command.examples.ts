import { Command } from '@mono/cli'

const cmd = new Command('myapp')
  .setVersion('1.0.0')
  .setDescription('A test application', 'another line')
  .addArgument('<input>', 'input file')
  .addArgument('[output]', 'output file', { defaultValue: 'out.txt' })
  .addOption('-v, --verbose', 'verbose output', { group: 'Output Options' })
  .addOption('-f, --format <type>', 'output format', {
    env: 'MYAPP_FORMAT',
    choices: ['json', 'xml'],
    group: 'Output Options',
  })
  .addOption('-h, --help', 'display help')

cmd.command('sub').setDescription('A subcommand')

/////////////

const parsedRoot = cmd.parseArgv(['input.txt', '--no-verbose', '--format', 'json'])
console.log(parsedRoot)
console.log('--------------')
console.log(parsedRoot.cmd.renderHelp())

console.log('------------------------------------------')

const parsedSub = cmd.parseArgv(['sub', '-h'])
console.log(parsedSub)
console.log('--------------')
console.log(parsedSub.cmd.renderHelp())
