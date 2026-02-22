import { ensureThat } from '@mono/is'
import type { ICommand } from '../types'
import { hasNoVariadicArguments } from '../validators/hasNoVariadicArguments'
import { hasNoOptionalArguments } from '../validators/hasNoOptionalArguments'

/**
 * Assert that adding a required argument to the given command is allowed.
 * This is not allowed if the command already has variadic or optional arguments.
 */
export function assertAddRequiredArgumentAllowed(cmd: ICommand): void {
  ensureThat(cmd, [hasNoVariadicArguments, hasNoOptionalArguments], {
    message: 'Adding required argument not allowed after variadic or optional arguments.',
  })
}
