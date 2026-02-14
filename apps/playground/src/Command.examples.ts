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
cmd.help.styleUsage = (str) => `>>> ${str} <<<`

cmd.command('licka').setGroup('CAT B')
cmd
  .command('sub')
  .setGroup('CAT A')
  .setDescription('A subcommand')
  .addArgument('<arg1>', 'first argument')
  .addOption('-w, --wow', 'a wow option')
  .setAction(async (a) => {
    console.log('Subcommand executed', a)
  })
  .addTrigger('wow', async ({ args, cmd, opts }) => {
    console.log('Trigger executed because args includes WOW', args)
    console.log({ opts })
  })

/////////////

// const parsedRoot = cmd.parseArgv(['input.txt', '--no-verbose', '--format', 'json'])
// console.log(parsedRoot)
// console.log('--------------')
// console.log(parsedRoot.cmd.renderHelp())

console.log('------------------------------------------')

const parsedSub = cmd.parseArgv(['sub', '--wow'])
// const parsedSub = cmd.parseArgv(['sub', 'WOW'])
console.log(parsedSub)
console.log('--------------')
console.log(parsedSub.cmd.renderHelp())
void parsedSub.execute?.()
