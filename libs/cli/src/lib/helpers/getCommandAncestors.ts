import type { ICommand } from '../types'
import getCommandAndAncestors from './getCommandAndAncestors'

/** Returns all ancestor commands excluding this command */
export default function getCommandAncestors<C extends ICommand>(cmd: C) {
  return getCommandAndAncestors(cmd).slice(1) as C[]
}
