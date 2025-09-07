// import { Help as CommanderHelp, type Command as CommanderCommand } from 'commander'

// interface CommanderDescriptor {
//   _hidden?: boolean
//   parent: CommanderDescriptor | null
//   commands: CommanderDescriptor[]
//   options: {
//     flags: string
//     description: string
//     required: boolean
//     optional: boolean
//     variadic: boolean
//     short?: string
//     long?: string
//     negate: boolean
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     defaultValue?: any
//     defaultValueDescription?: string
//     envVar?: string
//     hidden: boolean
//     argChoices?: string[]
//     helpGroupHeading?: string
//     presetArg?: string
//     isBoolean(): boolean
//   }[]
//   registeredArguments: {
//     description: string
//     required: boolean
//     variadic: boolean
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     defaultValue?: any
//     defaultValueDescription?: string
//     argChoices?: string[]
//   }[]
//   name(): string
//   alias(): string
//   _aliases: string[]
//   summary(): string
//   description(): string
//   usage(): string
//   helpGroup(): string | undefined
//   configureHelp(): Partial<CommanderHelp>
// }

// class Adapter implements CommanderDescriptor {
//   constructor(protected cmd: Command) {}

//   get _hidden() {
//     return this.cmd.hidden
//   }

//   @lazyProp
//   get parent(): CommanderDescriptor | null {
//     return this.cmd.parent ? new Adapter(this.cmd.parent) : null
//   }

//   @lazyProp
//   get commands() {
//     return this.cmd.commands.map((c) => new Adapter(c))
//   }

//   get options() {
//     return this.cmd.options.map((opt) => ({
//       flags: opt.flags,
//       name: () => opt.name,
//       description: opt.description,
//       required: opt.required || false,
//       optional: opt.optional || false,
//       variadic: opt.variadic || false,
//       short: opt.short,
//       long: opt.long,
//       negate: opt.negate || false,
//       defaultValue: opt.defaultValue,
//       defaultValueDescription: opt.defaultValueDescription,
//       envVar: opt.env,
//       hidden: opt.hidden || false,
//       argChoices: opt.choices,
//       helpGroupHeading: opt.group,
//       presetArg: undefined,
//       isBoolean: () => opt.type === 'boolean',
//     }))
//   }

//   get registeredArguments() {
//     return this.cmd.arguments.map((arg) => ({
//       name: () => arg.name,
//       description: arg.description,
//       required: arg.required || false,
//       variadic: arg.variadic || false,
//       defaultValue: arg.defaultValue,
//       defaultValueDescription: arg.defaultValueDescription,
//       argChoices: arg.choices,
//     }))
//   }

//   name() {
//     return this.cmd.name
//   }

//   alias() {
//     return this.cmd.aliases[0] || ''
//   }

//   get _aliases() {
//     return this.cmd.aliases
//   }

//   summary() {
//     return this.cmd.summary || ''
//   }

//   description() {
//     return this.cmd.description || ''
//   }

//   usage() {
//     const args = this.registeredArguments.map((arg) => {
//       const nameOutput = arg.name() + (arg.variadic === true ? '...' : '')

//       return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']'
//     })
//     return [
//       ...(this.options.length ? ['[options]'] : []),
//       ...(this.commands.length ? ['[command]'] : []),
//       ...(this.registeredArguments.length ? args : []),
//     ].join(' ')
//   }

//   helpGroup() {
//     return this.cmd.group
//   }

//   configureHelp() {
//     return this.cmd.helpConfiguration as Partial<CommanderHelp>
//   }

//   _getHelpOption() {
//     return undefined
//   }
//   _getHelpCommand() {
//     return undefined
//   }
// }

// function toCommander(cmd: Command, help: CommanderHelp): string {
//   const adapter = new Adapter(cmd) as unknown as CommanderCommand
//   const helper = Object.assign(help, adapter.configureHelp())
//   return helper.formatHelp(adapter, helper)
// }

// const cmd = new Command('myapp')
//   .setVersion('1.0.0')
//   .setDescription('A test application', 'another line')
//   .addArgument('<input>', 'input file')
//   .addArgument('[output]', 'output file', { defaultValue: 'out.txt' })
//   .addOption('-v, --verbose', 'verbose output', { group: 'Output Options' })
//   .addOption('-f, --format <type>', 'output format', {
//     env: 'MYAPP_FORMAT',
//     choices: ['json', 'xml'],
//     group: 'Output Options',
//   })
//   .addOption('-h, --help', 'display help')

// const str = toCommander(cmd, new CommanderHelp())
// console.log(str)
