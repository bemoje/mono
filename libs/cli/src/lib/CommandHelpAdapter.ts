import lazyProp from './internal/lazyProp'
import { Command, ArgumentDescriptor, ArgumentUsage, OptionDescriptor, OptionUsage } from './Command'
import { Help, type ICommandHelp, type IHelp } from './Help'
import { renderHelp } from './renderHelp'

/**
 * Adapter for @see Command instances that implements the @see ICommandHelp interface required by the Help system.
 * Used internally by the @see Command.prototype.renderHelp method.
 */
export class CommandHelpAdapter implements ICommandHelp {
  constructor(public cmd: Command) {}

  renderHelp(help: IHelp = new Help()) {
    return renderHelp(this, help)
  }

  get name() {
    return this.cmd.name
  }

  get aliases() {
    return this.cmd.aliases
  }

  get summary() {
    return (
      this.cmd.summary ?? (this.cmd.description.includes('\n') ? this.cmd.description.split('\n')[0] : undefined)
    )
  }

  get description() {
    return this.cmd.description
  }

  get hidden() {
    return this.cmd.hidden
  }

  @lazyProp
  get usage() {
    return [
      ...(this.cmd.options.length ? ['[options]'] : []),
      ...(this.cmd.commands.length ? ['[command]'] : []),
      ...this.cmd.arguments.map((arg) => this.renderArgumentFlags(arg)),
    ].join(' ')
  }

  get group() {
    return this.cmd.group
  }

  @lazyProp
  get commands(): ICommandHelp[] {
    return this.cmd.commands.map((c) => new CommandHelpAdapter(c))
  }

  get options() {
    return this.cmd.options.map((opt) => ({
      ...opt,
      flags: this.renderOptionFlags(opt) as string,
      long: opt.name,
      optional: !opt.required,
      negate: false,
      variadic: opt.multiple,
    }))
  }

  @lazyProp
  get arguments() {
    return this.cmd.arguments.map((arg) => ({
      ...arg,
      variadic: arg.multiple,
    }))
  }

  @lazyProp
  get parent(): ICommandHelp | null {
    return this.cmd.parent ? new CommandHelpAdapter(this.cmd.parent) : null
  }

  @lazyProp
  get helpConfiguration(): Partial<IHelp> {
    return { ...this.cmd.helpConfiguration }
  }

  renderArgumentFlags(arg: ArgumentDescriptor): ArgumentUsage {
    return (
      arg.required
        ? arg.multiple
          ? `<${arg.name}...>`
          : `<${arg.name}>`
        : arg.multiple
          ? `[${arg.name}...]`
          : `[${arg.name}]`
    ) as ArgumentUsage
  }

  renderOptionFlags(opt: OptionDescriptor): OptionUsage {
    const flags = `-${opt.short}, --${opt.name}`
    return (
      opt.type === 'boolean'
        ? flags
        : opt.required
          ? opt.multiple
            ? flags + ` <${opt.argName}...>`
            : flags + ` <${opt.argName}>`
          : opt.multiple
            ? flags + ` [${opt.argName}...]`
            : flags + ` [${opt.argName}]`
    ) as OptionUsage
  }
}
