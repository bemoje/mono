import type { ArgumentOptions, ArgumentUsage } from './types.internal'
import assertNoMultipleVariadicArguments from './helpers/assertNoMultipleVariadicArguments'
import assertNoOptionalOrVariadicArguments from './helpers/assertNoOptionalOrVariadicArguments'
import assertNoVariadicArgument from './helpers/assertNoVariadicArgument'
import type { IArgument, ICommand } from './types'

/**
 * Defines a command-line argument
 */
export class Argument implements IArgument {
  usage: string
  name: string
  description: string
  required?: boolean
  variadic?: boolean
  choices?: string[]
  defaultValue?: string | string[]
  defaultValueDescription?: string

  constructor(cmd: ICommand, usage: ArgumentUsage, description?: string, opts: Partial<ArgumentOptions> = {}) {
    const match = usage.match(/^<(.*?)>$|^\[(.*?)\]$/)
    if (!match) throw new Error(`Invalid argument format: ${usage}`)
    const nameMatch = match[1] || match[2]
    const name = nameMatch.replace(/\.\.\.$/, '')
    this.usage = usage
    this.name = name
    this.description = description || ''
    if (usage.startsWith('<')) {
      if (nameMatch.endsWith('...')) {
        assertNoMultipleVariadicArguments(cmd)
        this.required = true
        this.variadic = true
      } else {
        assertNoOptionalOrVariadicArguments(cmd)
        this.required = true
      }
    } else if (usage.startsWith('[')) {
      if (nameMatch.endsWith('...')) {
        assertNoMultipleVariadicArguments(cmd)
        this.variadic = true
        this.defaultValue = (opts.defaultValue ?? []) as string[]
      } else {
        assertNoVariadicArgument(cmd)
      }
    }

    // Assign options
    for (const [key, value] of Object.entries(opts)) {
      if (value !== undefined) Reflect.set(this, key, value)
    }

    // Clean up undefined properties
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) Reflect.deleteProperty(this, key)
    }
  }
}
