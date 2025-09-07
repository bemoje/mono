// import type { Command as Commander } from 'commander'

// /**
//  * Adapter for commander.js @see Command instances that implements the @see CommandDescriptor interface required by the Help system.
//  */
// export class CommanderHelpAdapter implements CommandDescriptor {
//   constructor(public cmd: Commander) {}

//   get name() {
//     return this.cmd.name()
//   }

//   get aliases() {
//     return this.cmd.aliases()
//   }

//   get summary() {
//     return this.cmd.summary()
//   }

//   get description() {
//     return this.cmd.description()
//   }

//   get hidden() {
//     return Reflect.get(this.cmd, '_hidden')
//   }

//   get usage() {
//     return this.cmd.usage()
//   }

//   get group() {
//     return this.cmd.helpGroup()
//   }

//   @lazyProp
//   get commands() {
//     return this.cmd.commands.map((c) => new CommanderHelpAdapter(c))
//   }

//   get options() {
//     return this.cmd.options.map((opt) => ({
//       ...opt,
//       name: opt.name(),
//       short: opt.short ?? opt.name()[0],
//       long: opt.long ?? opt.name(),
//     }))
//   }

//   get arguments() {
//     return this.cmd.registeredArguments.map((arg) => ({
//       ...arg,
//       name: arg.name(),
//     }))
//   }

//   @lazyProp
//   get parent(): CommandDescriptor | null {
//     return this.cmd.parent ? new CommanderHelpAdapter(this.cmd.parent) : null
//   }

//   get helpConfiguration(): Partial<IHelp> {
//     return this.cmd.configureHelp() as Partial<IHelp>
//   }
// }

// /**
//  *
//  * @example ```ts
//  * import { Command } from 'commander'
//  * import { renderCommanderHelp } from '@bemoje/cli'
//  *
//  * const app = new Command('myapp')
//  * renderCommanderHelp(app)
//  * ```
//  */
// export function renderCommanderHelp(cmd: Commander, help: IHelp = new Help()) {
//   return renderHelp(new CommanderHelpAdapter(cmd), help)
// }
