import { parseOptionFlags } from './helpers/parseOptionFlags'
import type { ICommand, IOption } from './types'
import type { OptionOptions, OptionUsage } from './types.internal'

/**
 * Represents a command-line option with support for short/long flags and various configurations.
 */
export class Option<Long extends string = string> implements IOption {
  type: 'boolean' | 'string'
  flags: string
  short: string
  long: string
  name: string
  description: string
  argName?: string
  required?: boolean
  variadic?: boolean
  defaultValue?: boolean | string | string[]
  defaultValueDescription?: string
  env?: string
  hidden?: boolean
  choices?: string[]
  group?: string

  constructor(cmd: ICommand, flags: OptionUsage<Long>, description?: string, opts: Partial<OptionOptions> = {}) {
    const { short, long, name, argName } = parseOptionFlags<Long>(cmd, flags)
    this.flags = flags
    this.short = short
    this.long = long
    this.name = name
    this.description = description || ''
    if (!argName) {
      this.type = 'boolean'
    } else {
      this.type = 'string'
      this.argName = argName
      if (flags.endsWith('>')) {
        if (flags.endsWith('...>')) {
          this.required = true
          this.variadic = true
        } else {
          this.required = true
        }
      } else if (flags.endsWith(']')) {
        if (flags.endsWith('...]')) {
          this.variadic = true
          this.defaultValue = (opts.defaultValue ?? []) as string[]
        }
      }
    }

    // Assign options
    for (const [key, value] of Object.entries(opts)) {
      if (value !== undefined) Reflect.set(this, key, value)
    }

    // If defined, set environment variable as defaultValue
    if (this.env && this.defaultValue === undefined && typeof process.env[this.env] === 'string') {
      if (this.type === 'boolean') {
        this.defaultValue = /^(t(rue)?|y(es)?|1)$/i.test(process.env[this.env]!)
      } else if (this.variadic) {
        this.defaultValue = process.env[this.env]!.replace(/\]|\[/, '')
          .split(',')
          .map((v) => v.trim())
      } else {
        this.defaultValue = process.env[this.env]!
      }
    }
  }
}
