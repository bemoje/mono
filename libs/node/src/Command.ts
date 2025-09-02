import { parseArgs } from 'node:util'

/** Base descriptor for command-line arguments with shared properties */
interface ArgumentDescriptorBase {
  name: string
  required: boolean
  description: string
  multiple: boolean
  default?: string | string[]
}

/** Required positional argument descriptor. Usage: `<name>` */
interface RequiredArgumentDescriptor extends ArgumentDescriptorBase {
  multiple: false
  required: true
}

/** Optional positional argument with string default. Usage: `[name]` */
interface OptionalArgumentDescriptor extends ArgumentDescriptorBase {
  required: false
  multiple: false
  default?: string
}

/** Required variadic argument accepting multiple values. Usage: `<name...>` */
interface RequiredVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required: true
  multiple: true
}

/** Optional variadic argument with array default. Usage: `[name...]` */
interface OptionalVariadicArgumentDescriptor extends ArgumentDescriptorBase {
  required: false
  multiple: true
  default?: string[]
}

/** Base descriptor for command-line options with shared properties */
interface OptionalDescriptorBase {
  type: 'boolean' | 'string'
  short: string
  name: string
  required: boolean
  description: string
  multiple: boolean
  default?: boolean | string | string[]
}

/** Boolean flag option. Usage: `-v, --verbose` */
interface BooleanOptionDescriptor extends OptionalDescriptorBase {
  type: 'boolean'
  required: false
  multiple: false
  default: false
}

/** Required string option. Usage: `-f, --file <path>` */
interface RequiredOptionDescriptor extends OptionalDescriptorBase {
  type: 'string'
  required: true
  multiple: false
}

/** Optional string option with default. Usage: `-o, --output [path]` */
interface OptionalOptionDescriptor extends OptionalDescriptorBase {
  type: 'string'
  required: false
  multiple: false
  default?: string
}

/** Required option accepting multiple values. Usage: `-i, --include <patterns...>` */
interface RequiredVariadicOptionDescriptor extends OptionalDescriptorBase {
  type: 'string'
  required: true
  multiple: true
}

/** Optional option accepting multiple values with defaults. Usage: `-e, --exclude [patterns...]` */
interface OptionalVariadicOptionDescriptor extends OptionalDescriptorBase {
  type: 'string'
  required: false
  multiple: true
  default?: string[]
}

/** Union type for all argument descriptor variants */
type ArgumentDescriptor =
  | RequiredArgumentDescriptor
  | OptionalArgumentDescriptor
  | RequiredVariadicArgumentDescriptor
  | OptionalVariadicArgumentDescriptor

/** Union type for all option descriptor variants */
type OptionDescriptor =
  | BooleanOptionDescriptor
  | RequiredOptionDescriptor
  | OptionalOptionDescriptor
  | RequiredVariadicOptionDescriptor
  | OptionalVariadicOptionDescriptor

export type CommandTypes = {
  ArgumentDescriptorBase: ArgumentDescriptorBase
  RequiredArgumentDescriptor: RequiredArgumentDescriptor
  OptionalArgumentDescriptor: OptionalArgumentDescriptor
  RequiredVariadicArgumentDescriptor: RequiredVariadicArgumentDescriptor
  OptionalVariadicArgumentDescriptor: OptionalVariadicArgumentDescriptor
  OptionalDescriptorBase: OptionalDescriptorBase
  BooleanOptionDescriptor: BooleanOptionDescriptor
  RequiredOptionDescriptor: RequiredOptionDescriptor
  OptionalOptionDescriptor: OptionalOptionDescriptor
  RequiredVariadicOptionDescriptor: RequiredVariadicOptionDescriptor
  OptionalVariadicOptionDescriptor: OptionalVariadicOptionDescriptor
  ArgumentDescriptor: ArgumentDescriptor
  OptionDescriptor: OptionDescriptor
}

/**
 * Command-line argument parser with fluent API and type-safe validation.
 * Enforces CLI argument ordering rules and provides structured parsing results.
 *
 * @example
 * ```typescript
 * const cmd = new Command('myapp', '1.0.0')
 *   .argument('<input>', 'input file')
 *   .argument('[output]', 'output file', 'out.txt')
 *   .option('-v, --verbose', 'verbose output')
 *   .option('-f, --format <type>', 'output format')
 *
 * const result = cmd.parse(['input.txt', '-v', '-f', 'json'])
 * ```
 */
export class Command {
  name: string
  version: string
  description: string
  /** Collected argument descriptors in order of definition */
  arguments: ArgumentDescriptor[] = []
  /** Collected option descriptors */
  options: OptionDescriptor[] = []

  constructor(name: string, version = '0.0.0', description = '') {
    this.name = name
    this.version = version
    this.description = description
  }

  /** Add required argument. Usage: `<name>` */
  argument(usage: `<${string}>`, description: string): this
  /** Add optional argument with default. Usage: `[name]` */
  argument(usage: `[${string}]`, description: string, defaultValue?: string): this
  /** Add required variadic argument. Usage: `<name...>` */
  argument(usage: `<${string}...>`, description: string, defaultValue?: string[]): this
  /** Add optional variadic argument with defaults. Usage: `[name...]` */
  argument(usage: `[${string}...]`, description: string, defaultValue?: string[]): this

  /**
   * Adds a positional argument to the command with automatic type inference.
   * Enforces proper CLI argument ordering (required before optional before variadic).
   */
  argument(
    usage:
      | `<${string}>` //
      | `[${string}]`
      | `<${string}...>`
      | `[${string}...]`,
    description: string,
    defaultValue?: string | string[],
  ) {
    // Match <arg> or <arg...> or [arg] or [arg...]
    const match = usage.match(/^<(.*?)>$|^\[(.*?)\]$/)
    if (!match) throw new Error(`Invalid argument format: ${usage}`)
    const nameMatch = match[1] || match[2]
    const name = nameMatch.replace(/\.\.\.$/, '')
    this.assertArgumentNameNotInUse(name)
    if (usage.startsWith('<')) {
      if (nameMatch.endsWith('...')) {
        this.addRequiredVariadicArgumentDescriptor(name, description)
      } else {
        this.addRequiredArgumentDescriptor(name, description)
      }
    } else if (usage.startsWith('[')) {
      if (nameMatch.endsWith('...')) {
        this.addOptionalVariadicArgumentDescriptor(name, description, defaultValue as string[] | undefined)
      } else {
        this.addOptionalArgumentDescriptor(nameMatch, description, (defaultValue as string | undefined) ?? '')
      }
    } else {
      throw new Error(`Invalid argument format: ${usage}`)
    }
    return this
  }

  /** Add boolean flag option. Usage: `-v, --verbose` */
  option(usage: `-${string}, --${string}`, description: string): this
  /** Add required string option. Usage: `-f, --file <path>` */
  option(usage: `-${string}, --${string} <${string}>`, description: string): this
  /** Add optional string option with default. Usage: `-o, --output [path]` */
  option(usage: `-${string}, --${string} [${string}]`, description: string, defaultValue?: string): this
  /** Add required variadic option. Usage: `-i, --include <patterns...>` */
  option(usage: `-${string}, --${string} <${string}...>`, description: string, defaultValue?: string[]): this
  /** Add optional variadic option with defaults. Usage: `-e, --exclude [patterns...]` */
  option(usage: `-${string}, --${string} [${string}...]`, description: string, defaultValue?: string[]): this

  /**
   * Adds a command-line option with automatic type inference.
   * Parses format: `-s, --long [<value>|[value]|<value...>|[value...]]`
   */
  option(
    usage:
      | `-${string}, --${string}`
      | `-${string}, --${string} <${string}>`
      | `-${string}, --${string} [${string}]`
      | `-${string}, --${string} <${string}...>`
      | `-${string}, --${string} [${string}...]`,
    description: string,
    defaultValue?: string | string[],
  ) {
    // First try to match the general pattern to extract parts
    const match = usage.match(/^-(.+?), --([a-zA-Z][\w-]*)(?:\s*(<(.+?)>|\[(.+?)\]))?$/)
    if (!match) throw new Error(`Invalid option format: ${usage}`)
    const short = match[1]
    const name = match[2]
    this.assertValidShortName(short)
    this.assertOptionNameNotInUse(name, short)
    const argName = match[4] || match[5]
    if (!argName) {
      this.addBooleanOptionDescriptor(short, name, description)
    } else if (usage.endsWith('>')) {
      if (usage.endsWith('...>')) {
        this.addRequiredVariadicOptionDescriptor(short, name, description, defaultValue as string[])
      } else {
        this.addRequiredOptionDescriptor(short, name, description)
      }
    } else if (usage.endsWith(']')) {
      if (usage.endsWith('...]')) {
        this.addOptionalVariadicOptionDescriptor(short, name, description, defaultValue as string[])
      } else {
        this.addOptionalOptionDescriptor(short, name, description, defaultValue as string | undefined)
      }
    } else {
      throw new Error(`Invalid option format: ${usage}`)
    }
    return this
  }

  /**
   * Parses command-line arguments using Node.js parseArgs.
   * Returns structured object with parsed arguments and options.
   *
   * @example
   * ```typescript
   * const result = cmd.parse(['input.txt', '-v', '--format', 'json'])
   * // { arguments: ['input.txt'], options: { verbose: true, format: 'json' } }
   * ```
   */
  parse(argv?: string[]) {
    const optionsConfig = Object.fromEntries(
      this.options.map((o) => {
        return [o.name, o]
      }),
    )
    const parsed = parseArgs({
      args: argv,
      options: optionsConfig,
      allowPositionals: true,
      tokens: true,
      strict: true,
      allowNegative: false,
    })

    // Process tokens to handle variadic options that should consume multiple consecutive arguments
    const processedValues = { ...parsed.values }
    const processedPositionals = [...parsed.positionals]

    // Find variadic options and collect their consecutive arguments
    for (let i = 0; i < parsed.tokens.length; i++) {
      const token = parsed.tokens[i]
      if (token.kind === 'option') {
        const optionDescriptor = this.options.find((o) => o.name === token.name)
        if (optionDescriptor && optionDescriptor.multiple && optionDescriptor.type === 'string') {
          // This is a variadic option, collect consecutive positional arguments
          const values = [token.value] // Start with the option's own value
          let j = i + 1

          // Look for consecutive positionals
          while (j < parsed.tokens.length && parsed.tokens[j].kind === 'positional') {
            const positionalToken = parsed.tokens[j]
            if (positionalToken.kind === 'positional') {
              values.push(positionalToken.value)
              // Remove from processed positionals
              const posIndex = processedPositionals.indexOf(positionalToken.value)
              if (posIndex !== -1) {
                processedPositionals.splice(posIndex, 1)
              }
            }
            j++
          }

          // Update the option value with all collected values (filter out undefined)
          processedValues[token.name] = values.filter((v): v is string => v !== undefined)
        }
      }
    }

    // Handle positional arguments
    const parsedArguments = this.arguments.map((arg, index) => {
      if (arg.multiple) {
        // Variadic argument gets all remaining positionals
        const remainingArgs = processedPositionals.slice(index)
        return remainingArgs.length > 0 ? remainingArgs : (arg.default ?? [])
      } else {
        // Regular argument gets positional at index or default
        return processedPositionals[index] ?? arg.default
      }
    })

    // Merge default option values with processed values
    const optionValues = { ...processedValues }
    for (const option of this.options) {
      if (!(option.name in optionValues) && 'default' in option) {
        optionValues[option.name] = option.default
      }
    }

    return {
      arguments: parsedArguments,
      options: optionValues,
    }
  }

  /** Validates CLI argument ordering: required args must come before optional/variadic */
  private assertNoOptionalOrVariadicArguments() {
    if (this.arguments.some((arg) => !arg.required || 'default' in arg)) {
      throw new Error('Cannot add required argument after optional or variadic arguments')
    }
  }

  /** Validates that optional args don't follow variadic args */
  private assertNoVariadicArgument() {
    if (this.arguments.some((arg) => arg.multiple)) {
      throw new Error('Cannot add optional argument after variadic argument')
    }
  }

  /** Ensures only one variadic argument per command */
  private assertNoMultipleVariadicArguments() {
    if (this.arguments.some((arg) => arg.multiple)) {
      throw new Error('Cannot add more than one variadic argument')
    }
  }

  /** Validates argument names are unique across arguments and options */
  private assertArgumentNameNotInUse(name: string) {
    if (this.arguments.some((arg) => arg.name === name)) {
      throw new Error(`Argument name already in use: ${name}`)
    }
    if (this.options.some((opt) => opt.name === name)) {
      throw new Error(`Argument name already in use: ${name}`)
    }
  }

  /** Validates option names and short names are unique */
  private assertOptionNameNotInUse(name: string, short: string) {
    if (this.options.some((opt) => opt.name === name || opt.short === short)) {
      throw new Error(`Option name already in use: ${name} or ${short}`)
    }
  }

  /** Validates short option name format (single letter) */
  private assertValidShortName(short: string) {
    if (short.length !== 1 || !/^[a-zA-Z]$/.test(short)) {
      // For multi-character inputs, report only the first character in the error message
      const reportedChar = short.charAt(0)
      throw new Error(`Invalid short option name: ${reportedChar}. Must be a single letter.`)
    }
  }

  /** Creates and validates required argument descriptor */
  private addRequiredArgumentDescriptor(name: string, description: string) {
    this.assertNoOptionalOrVariadicArguments()
    this.arguments.push({ name, description, required: true, multiple: false })
  }

  /** Creates and validates optional argument descriptor */
  private addOptionalArgumentDescriptor(name: string, description: string, defaultValue?: string) {
    this.assertNoVariadicArgument()
    this.arguments.push({ name, description, required: false, multiple: false, default: defaultValue })
  }

  /** Creates and validates required variadic argument descriptor */
  private addRequiredVariadicArgumentDescriptor(name: string, description: string) {
    this.assertNoMultipleVariadicArguments()
    this.arguments.push({ name, description, required: true, multiple: true })
  }

  /** Creates and validates optional variadic argument descriptor */
  private addOptionalVariadicArgumentDescriptor(name: string, description: string, defaultValue: string[] = []) {
    this.assertNoMultipleVariadicArguments()
    this.arguments.push({ name, description, required: false, multiple: true, default: defaultValue })
  }

  /** Creates boolean option descriptor */
  private addBooleanOptionDescriptor(short: string, name: string, description: string) {
    this.options.push({
      type: 'boolean',
      short,
      name,
      description,
      required: false,
      multiple: false,
      default: false,
    })
  }

  /** Creates required string option descriptor */
  private addRequiredOptionDescriptor(short: string, name: string, description: string) {
    this.options.push({
      type: 'string',
      short,
      name,
      description,
      required: true,
      multiple: false,
    })
  }

  /** Creates optional string option descriptor */
  private addOptionalOptionDescriptor(short: string, name: string, description: string, defaultValue?: string) {
    this.options.push({
      type: 'string',
      short,
      name,
      description,
      required: false,
      multiple: false,
      default: defaultValue,
    })
  }

  /** Creates required variadic option descriptor */
  private addRequiredVariadicOptionDescriptor(
    short: string,
    name: string,
    description: string,
    defaultValue?: string[],
  ) {
    this.options.push({
      type: 'string',
      short,
      name,
      description,
      required: true,
      multiple: true,
      default: defaultValue,
    })
  }

  /** Creates optional variadic option descriptor */
  private addOptionalVariadicOptionDescriptor(
    short: string,
    name: string,
    description: string,
    defaultValue: string[] = [],
  ) {
    this.options.push({
      type: 'string',
      short,
      name,
      description,
      required: false,
      multiple: true,
      default: defaultValue,
    })
  }
}
