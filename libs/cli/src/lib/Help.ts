import type { Argument } from './types'
import C from 'ansi-colors'
import type { ICommand } from './types'
import type { IHelp } from './types'
import type { Option } from './types'
import { lazyProp } from '@mono/decorators'

/**
 * This is a fork of the Help class from the 'commander' npm package. The Help class method names as well as the
 * expected interface of the Command instance to parse, are both similar, but different and not compatible without
 * custom adaptations, @see ICommand
 */
export class Help implements IHelp {
  protected readonly cmd: ICommand
  /** output helpWidth, long lines are wrapped to fit */
  helpWidth: number = process.stdout.isTTY ? process.stdout.columns : 80
  minWidthToWrap: number = 40
  sortSubcommands: boolean = true
  sortOptions: boolean = true
  usageDisplayOptionsAs: string = '[opts]'
  usageDisplaySubcommandAs: string = '[cmd]'

  constructor(cmd: ICommand) {
    this.cmd = cmd
    Object.defineProperty(this, 'cmd', { enumerable: false })
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  @lazyProp
  visibleCommands(): ICommand[] {
    const res = Object.values(this.cmd.commands).filter((c) => {
      return !c.hidden
    })
    if (this.sortSubcommands) {
      res.sort((a: ICommand, b: ICommand) => {
        return a.name.localeCompare(b.name)
      })
    }
    return res
  }

  /**
   * Compare options for sort.
   */
  compareOptions(a: Option, b: Option): number {
    const getSortKey = (option: Option): string => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long!.replace(/^--/, '')
    }
    return getSortKey(a).localeCompare(getSortKey(b))
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  @lazyProp
  visibleOptions(): Option[] {
    const res = this.cmd.options.filter((option: Option) => {
      return !option.hidden
    })
    if (this.sortOptions) {
      res.sort(this.compareOptions)
    }
    return res
  }

  /**
   * Get an array of the arguments if any have a description.
   */
  @lazyProp
  visibleArguments(): Argument[] {
    // If there are any arguments with a description then return all the arguments.
    if (
      this.cmd.arguments.find((argument: Argument) => {
        return !!argument.description
      })
    ) {
      return [...this.cmd.arguments]
    }
    return []
  }

  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(sub: ICommand): string {
    const args = sub.arguments
      .map((arg) => {
        return arg.usage
      })
      .join(' ')
    return (
      (sub.aliases[0] ? `${sub.aliases[0].padEnd(this.longestSubcommandAliasLength(), ' ')} | ` : '') +
      sub.name +
      (sub.options.length ? ` ${this.usageDisplayOptionsAs}` : '') + // simplistic check for non-help option
      (args ? ` ${args}` : '')
    )
  }

  /**
   * Get the option term to show in the list of options.
   */
  optionTerm(option: Option): string {
    return option.flags
  }

  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: Argument): string {
    return argument.name
  }

  /**
   * Get the longest subcommand primary alias length.
   */
  @lazyProp
  longestSubcommandAliasLength(): number {
    return Math.max(
      0,
      ...this.visibleCommands().map((c) => {
        return c.aliases[0]?.length || 0
      }),
    )
  }

  /**
   * Get the longest subcommand term length.
   */
  @lazyProp
  longestSubcommandTermLength(): number {
    return this.visibleCommands().reduce((max: number, command) => {
      return Math.max(max, this.displayWidth(this.styleSubcommandTerm(this.subcommandTerm(command))))
    }, 0)
  }

  /**
   * Get the longest option term length.
   */
  @lazyProp
  longestOptionTermLength(): number {
    return this.visibleOptions().reduce((max: number, option) => {
      return Math.max(max, this.displayWidth(this.styleOptionTerm(this.optionTerm(option))))
    }, 0)
  }

  /**
   * Get the longest argument term length.
   */
  @lazyProp
  longestArgumentTermLength(): number {
    return this.visibleArguments().reduce((max: number, argument) => {
      return Math.max(max, this.displayWidth(this.styleArgumentTerm(this.argumentTerm(argument))))
    }, 0)
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(): string {
    // Usage
    let path = ''
    for (let ancestor = this.cmd.parent; ancestor; ancestor = ancestor.parent) {
      path = `${ancestor.name} ${path}`
    }

    return `${path + this.cmd.name} ${[
      ...(Object.keys(this.cmd.commands).length ? [this.usageDisplaySubcommandAs] : []),
      ...(this.cmd.options.length ? [this.usageDisplayOptionsAs] : []),
      ...this.cmd.arguments.map((arg) => {
        return arg.required
          ? arg.variadic
            ? `<${arg.name}...>`
            : `<${arg.name}>`
          : arg.variadic
            ? `[${arg.name}...]`
            : `[${arg.name}]`
      }),
    ].join(' ')}`.trim()
  }

  /**
   * Get the description for the command.
   */
  commandDescription(): string {
    let res = ''
    if (this.cmd.aliases.length) {
      res += `Aliases: ${this.cmd.aliases.join(', ')}`
      res += '\n\n'
    }
    res += this.cmd.description
    return res
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   */
  subcommandDescription(sub: ICommand): string {
    return (
      sub.summary ||
      (sub.description?.includes('\n') ? sub.description.trim().split('\n')[0] : sub.description.trim())
    )
  }

  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: Option): string {
    const extraInfo: string[] = []

    if (option.choices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.choices
          .map((choice: string) => {
            return String(choice)
          })
          .join(', ')}`,
      )
    }
    if (option.defaultValue && !(Array.isArray(option.defaultValue) && option.defaultValue.length === 0)) {
      extraInfo.push(`default: ${option.defaultValueDescription || String(option.defaultValue)}`)
    }

    if (option.env !== undefined) {
      extraInfo.push(`env: ${option.env}`)
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(', ')})`
      if (option.description) {
        return `${option.description} ${extraDescription}`
      }
      return extraDescription
    }

    return option.description ?? ''
  }

  /**
   * Get the argument description to show in the list of arguments.
   */
  argumentDescription(argument: Argument): string {
    const extraInfo: string[] = []
    if (argument.choices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.choices
          .map((choice: string) => {
            return String(choice)
          })
          .join(', ')}`,
      )
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || String(argument.defaultValue)}`)
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(', ')})`
      if (argument.description) {
        return `${argument.description} ${extraDescription}`
      }
      return extraDescription
    }
    return argument.description ?? ''
  }

  /**
   * Format a list of items, given a heading and an array of formatted items.
   */
  formatItemList(heading: string, items: string[]): string[] {
    if (items.length === 0) {
      return []
    }
    return [this.styleTitle(heading), ...items, '']
  }

  /**
   * Group items by their help group heading.
   */
  groupItems<T extends ICommand | Option>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]> {
    const result = new Map<string, T[]>()
    // Add groups in order of appearance in unsortedItems.
    unsortedItems.forEach((item: T) => {
      const group = getGroup(item)
      if (!result.has(group)) {
        result.set(group, [])
      }
    })
    // Add items in order of appearance in visibleItems.
    visibleItems.forEach((item: T) => {
      const group = getGroup(item)
      if (!result.has(group)) {
        result.set(group, [])
      }
      result.get(group)!.push(item)
    })
    return result
  }

  /**
   * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
   */
  displayWidth(str: string): number {
    // eslint-disable-next-line no-control-regex
    const sgrPattern = /\x1b\[\d*(;\d*)*m/g
    return str.replace(sgrPattern, '').length
  }

  /**
   * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
   */
  styleTitle(str: string): string {
    return C.yellow(str)
  }

  /**
   * Style the usage line for displaying in the help. Applies specific styling to different parts like options, commands, and arguments.
   */
  styleUsage(str: string): string {
    // Usage has lots of parts the user might like to color separately! Assume default usage string which is formed like:
    //    command subcommand [opts] [cmd] <foo> [bar]
    return str
      .split(' ')
      .map((word: string, index, arr) => {
        if (word === this.usageDisplaySubcommandAs) {
          return C.green(word)
        }
        if (word === this.usageDisplayOptionsAs) {
          return C.blue(word)
        }
        if (word[0] === '<') {
          return C.red(word)
        }
        if (word[0] === '[') {
          return C.cyan(word)
        }
        if (arr[index + 1]?.startsWith('[')) {
          return C.magenta(word)
        }
        return this.styleCommandText(word) // Restrict to initial words?
      })
      .join(' ')
  }

  /**
   * Style command descriptions for display in help output.
   */
  styleCommandDescription(str: string): string {
    return this.styleDescriptionText(str)
  }

  /**
   * Style option descriptions for display in help output.
   */
  styleOptionDescription(str: string): string {
    return C.gray(this.styleDescriptionText(str))
  }

  /**
   * Style subcommand descriptions for display in help output.
   */
  styleSubcommandDescription(str: string): string {
    return this.styleDescriptionText(str)
  }

  /**
   * Style argument descriptions for display in help output.
   */
  styleArgumentDescription(str: string): string {
    return C.gray(this.styleDescriptionText(str))
  }

  /**
   * Base style used by descriptions. Override in subclass to apply custom formatting.
   */
  styleDescriptionText(str: string): string {
    return C.gray(str)
  }

  /**
   * Style option terms (flags) for display in help output.
   */
  styleOptionTerm(str: string): string {
    return this.styleOptionText(str)
  }

  /**
   * Style subcommand terms for display in help output. Applies specific styling to different parts like options and arguments.
   */
  styleSubcommandTerm(str: string): string {
    // This is very like usage with lots of parts! Assume default string which is formed like:
    //    subcommand [opts] <foo> [bar]
    const res = str
      .split(' ')
      .map((word: string) => {
        if (word === this.usageDisplayOptionsAs) {
          return C.dim(word)
        }
        if (word[0] === '[' || word[0] === '<') {
          return C.dim(word)
        }
        return this.styleSubcommandText(word) // Restrict to initial words?
      })
      .join(' ')
    const split = res.split('|')
    if (split.length === 1) {
      return res
    }
    split[0] = C.green(split[0])
    return split.join('|')
  }

  /**
   * Style argument terms for display in help output.
   */
  styleArgumentTerm(str: string): string {
    return this.styleArgumentText(str)
  }

  /**
   * Base style used in terms and usage for options. Override in subclass to apply custom formatting.
   */
  styleOptionText(str: string): string {
    return str
  }

  /**
   * Base style used in terms and usage for arguments. Override in subclass to apply custom formatting.
   */
  styleArgumentText(str: string): string {
    return str
  }

  /**
   * Base style used in terms and usage for subcommands. Override in subclass to apply custom formatting.
   */
  styleSubcommandText(str: string): string {
    return str
  }

  /**
   * Base style used in terms and usage for commands. Override in subclass to apply custom formatting.
   */
  styleCommandText(str: string): string {
    return str
  }

  /**
   * Calculate the pad width from the maximum term length.
   */
  @lazyProp
  padWidth(): number {
    return Math.max(
      this.longestOptionTermLength(),
      this.longestSubcommandTermLength(),
      this.longestArgumentTermLength(),
    )
  }

  /**
   * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
   */
  preformatted(str: string): boolean {
    return /\n[^\S\r\n]/.test(str)
  }

  /**
   * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
   *
   * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
   *   TTT  DDD DDDD
   *        DD DDD
   */
  formatItem(term: string, termWidth: number, description: string): string {
    const itemIndent = 2
    const itemIndentStr = ' '.repeat(itemIndent)
    if (!description) {
      return itemIndentStr + term
    }

    // Pad the term out to a consistent width, so descriptions are aligned.
    const paddedTerm = term.padEnd(termWidth + term.length - this.displayWidth(term))

    // Format the description.
    const spacerWidth = 2 // between term and description
    const helpWidth = this.helpWidth
    const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent
    let formattedDescription: string
    if (remainingWidth < this.minWidthToWrap || this.preformatted(description)) {
      formattedDescription = description
    } else {
      const wrappedDescription = this.boxWrap(description, remainingWidth)
      formattedDescription = wrappedDescription.replace(/\n/g, `\n${' '.repeat(termWidth + spacerWidth)}`)
    }

    // Construct and overall indent.
    return (
      itemIndentStr +
      paddedTerm +
      ' '.repeat(spacerWidth) +
      formattedDescription.replace(/\n/g, `\n${itemIndentStr}`)
    )
  }

  /**
   * Wrap a string at whitespace, preserving existing line breaks.
   * Wrapping is skipped if the width is less than `minWidthToWrap`.
   */
  boxWrap(str: string, width: number): string {
    if (width < this.minWidthToWrap) {
      return str
    }

    const rawLines = str.split(/\r\n|\n/)
    // split up text by whitespace
    const chunkPattern = /[\s]*[^\s]+/g
    const wrappedLines: string[] = []
    rawLines.forEach((line: string) => {
      const chunks = line.match(chunkPattern)
      if (chunks === null) {
        wrappedLines.push('')
        return
      }

      let sumChunks = [chunks.shift()!]
      let sumWidth = this.displayWidth(sumChunks[0])
      chunks.forEach((chunk: string) => {
        const visibleWidth = this.displayWidth(chunk)
        // Accumulate chunks while they fit into width.
        if (sumWidth + visibleWidth <= width) {
          sumChunks.push(chunk)
          sumWidth += visibleWidth
          return
        }
        wrappedLines.push(sumChunks.join(''))

        const nextChunk = chunk.trimStart() // trim space at line break
        sumChunks = [nextChunk]
        sumWidth = this.displayWidth(nextChunk)
      })
      wrappedLines.push(sumChunks.join(''))
    })

    return wrappedLines.join('\n')
  }

  /**
   * Generate the built-in help text.
   */
  render(): string {
    // Usage
    let output = [`${this.styleTitle('Usage:')} ${this.styleUsage(this.commandUsage())}`, '']

    // Description
    const des = this.commandDescription()
    if (des.length > 0) {
      output = output.concat([this.boxWrap(this.styleCommandDescription(des), this.helpWidth), ''])
    }

    // Arguments
    const argumentList = this.visibleArguments().map((argument: Argument) => {
      return this.formatItem(
        this.styleArgumentTerm(this.argumentTerm(argument)),
        this.padWidth(),
        this.styleArgumentDescription(this.argumentDescription(argument)),
      )
    })
    output = output.concat(this.formatItemList('Arguments:', argumentList))

    // Options
    const optionGroups = this.groupItems(this.cmd.options, this.visibleOptions(), (option: Option) => {
      return option.group ?? 'Options:'
    })
    optionGroups.forEach((options, group) => {
      const optionList = options.map((option: Option) => {
        return this.formatItem(
          this.styleOptionTerm(this.optionTerm(option)),
          this.padWidth(),
          this.styleOptionDescription(this.optionDescription(option)),
        )
      })
      output = output.concat(this.formatItemList(group, optionList))
    })

    // Commands
    const commandGroups = this.groupItems(
      Object.values(this.cmd.commands),
      this.visibleCommands(),

      (sub: ICommand) => {
        return sub.group || 'Commands:'
      },
    )
    commandGroups.forEach((commands, group) => {
      const commandList = commands.map((sub: ICommand) => {
        return this.formatItem(
          this.styleSubcommandTerm(this.subcommandTerm(sub)),
          this.padWidth(),
          this.styleSubcommandDescription(this.subcommandDescription(sub)),
        )
      })
      output = output.concat(this.formatItemList(group, commandList))
    })

    return output.join('\n')
  }
}
