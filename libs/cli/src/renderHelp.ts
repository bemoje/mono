import { Help, ICommandHelp, IHelp } from './Help'

/**
 * Renders help for a command using the specified help instance.
 */
export function renderHelp(cmd: ICommandHelp, help: IHelp = new Help()) {
  const helper = Object.assign(help, cmd.helpConfiguration)
  return helper.formatHelp(cmd, helper)
}
