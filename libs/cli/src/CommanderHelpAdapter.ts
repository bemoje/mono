import type { Command as Commander } from 'commander'
import { Help, type ICommandHelp, type IHelp } from './Help'
import { lazyProp } from '@mono/decorators'
import { renderHelp } from './renderHelp'

/**
 * Adapter for commander.js @see Command instances that implements the @see ICommandHelp interface required by the Help system.
 *
 * @example ```ts
 * import { Command } from 'commander'
 * const cmd = new Command('myapp')
 * new CommanderHelpAdapter(cmd).renderHelp()
 * ```
 */
export class CommanderHelpAdapter implements ICommandHelp {
  constructor(public cmd: Commander) {}

  renderHelp(help: IHelp = new Help()) {
    return renderHelp(this, help)
  }

  get name() {
    return this.cmd.name()
  }

  get aliases() {
    return this.cmd.aliases()
  }

  @lazyProp
  get summary() {
    const cmdSummary = this.cmd.summary()
    return cmdSummary && cmdSummary.trim() !== ''
      ? cmdSummary
      : this.cmd.description().includes('\n')
        ? this.cmd.description().split('\n')[0]
        : undefined
  }

  get description() {
    return this.cmd.description()
  }

  get hidden() {
    return Reflect.get(this.cmd, '_hidden')
  }

  get usage() {
    return this.cmd.usage()
  }

  get group() {
    return this.cmd.helpGroup()
  }

  @lazyProp
  get commands() {
    return this.cmd.commands.map((c) => new CommanderHelpAdapter(c))
  }

  @lazyProp
  get options() {
    return this.cmd.options.map((opt) => ({
      ...opt,
      short: opt.short ?? opt.attributeName()[0],
      long: opt.long ?? opt.attributeName(),
    }))
  }

  @lazyProp
  get arguments() {
    return this.cmd.registeredArguments.map((arg) => ({
      ...arg,
      name: arg.name(),
    }))
  }

  @lazyProp
  get parent(): ICommandHelp | null {
    return this.cmd.parent ? new CommanderHelpAdapter(this.cmd.parent) : null
  }

  @lazyProp
  get helpConfiguration(): Partial<IHelp> {
    return { ...(this.cmd.configureHelp() as Partial<IHelp>) }
  }
}
