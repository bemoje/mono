import type { ArgumentDescriptorBase, CommandDescriptor, OptionDescriptorBase } from './Command'

/**
 * Although this is a class, methods are static in style to allow override using subclass or just functions.
 */
export class Help implements IHelp {
  /** output helpWidth, long lines are wrapped to fit */
  helpWidth: number = process.stdout.isTTY ? process.stdout.columns : 80
  minWidthToWrap: number = 40
  sortSubcommands?: boolean
  sortOptions?: boolean
  showGlobalOptions?: boolean

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  visibleCommands(cmd: CommandDescriptor): CommandDescriptor[] {
    const visibleCommands = cmd.commands.filter((cmd: CommandDescriptor) => !cmd.hidden)

    if (this.sortSubcommands) {
      visibleCommands.sort((a: CommandDescriptor, b: CommandDescriptor) => {
        return a.name.localeCompare(b.name)
      })
    }
    return visibleCommands
  }

  /**
   * Compare options for sort.
   */
  compareOptions(a: OptionDescriptorBase, b: OptionDescriptorBase): number {
    const getSortKey = (option: OptionDescriptorBase): string => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long!.replace(/^--/, '')
    }
    return getSortKey(a).localeCompare(getSortKey(b))
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  visibleOptions(cmd: CommandDescriptor): OptionDescriptorBase[] {
    const visibleOptions = cmd.options.filter((option: OptionDescriptorBase) => !option.hidden)

    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions)
    }
    return visibleOptions
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   */
  visibleGlobalOptions(cmd: CommandDescriptor): OptionDescriptorBase[] {
    if (!this.showGlobalOptions) return []

    const globalOptions: OptionDescriptorBase[] = []
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      const visibleOptions = ancestorCmd.options.filter((option: OptionDescriptorBase) => !option.hidden)
      globalOptions.push(...visibleOptions)
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions)
    }
    return globalOptions
  }

  /**
   * Get an array of the arguments if any have a description.
   */
  visibleArguments(cmd: CommandDescriptor): ArgumentDescriptorBase[] {
    // If there are any arguments with a description then return all the arguments.
    if (cmd.arguments.find((argument: ArgumentDescriptorBase) => argument.description)) {
      return [...cmd.arguments]
    }
    return []
  }

  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(cmd: CommandDescriptor): string {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd.arguments
      .map((arg: ArgumentDescriptorBase) => {
        const nameOutput = arg.name + (arg.variadic === true ? '...' : '')
        return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']'
      })
      .join(' ')
    return (
      cmd.name +
      (cmd.aliases[0] ? '|' + cmd.aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '')
    )
  }

  /**
   * Get the option term to show in the list of options.
   */
  optionTerm(option: OptionDescriptorBase): string {
    return option.flags
  }

  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: ArgumentDescriptorBase): string {
    return argument.name
  }

  /**
   * Get the longest command term length.
   */
  longestSubcommandTermLength(cmd: CommandDescriptor, helper: Help): number {
    return helper.visibleCommands(cmd).reduce((max: number, command: CommandDescriptor) => {
      return Math.max(max, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command))))
    }, 0)
  }

  /**
   * Get the longest option term length.
   */
  longestOptionTermLength(cmd: CommandDescriptor, helper: Help): number {
    return helper.visibleOptions(cmd).reduce((max: number, option: OptionDescriptorBase) => {
      return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))))
    }, 0)
  }

  /**
   * Get the longest global option term length.
   */
  longestGlobalOptionTermLength(cmd: CommandDescriptor, helper: Help): number {
    return helper.visibleGlobalOptions(cmd).reduce((max: number, option: OptionDescriptorBase) => {
      return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))))
    }, 0)
  }

  /**
   * Get the longest argument term length.
   */
  longestArgumentTermLength(cmd: CommandDescriptor, helper: Help): number {
    return helper.visibleArguments(cmd).reduce((max: number, argument: ArgumentDescriptorBase) => {
      return Math.max(max, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))))
    }, 0)
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(cmd: CommandDescriptor): string {
    // Usage
    let cmdName = cmd.name
    if (cmd.aliases[0]) {
      cmdName = cmdName + '|' + cmd.aliases[0]
    }
    let ancestorCmdNames = ''
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      ancestorCmdNames = ancestorCmd.name + ' ' + ancestorCmdNames
    }
    return (
      ancestorCmdNames +
      cmdName +
      ' ' +
      [
        ...(cmd.options.length ? ['[options]'] : []),
        ...(cmd.commands.length ? ['[command]'] : []),
        ...cmd.arguments.map((arg) => {
          return arg.required
            ? arg.variadic
              ? `<${arg.name}...>`
              : `<${arg.name}>`
            : arg.variadic
              ? `[${arg.name}...]`
              : `[${arg.name}]`
        }),
      ].join(' ')
    )
  }

  /**
   * Get the description for the command.
   */
  commandDescription(cmd: CommandDescriptor): string {
    return cmd.description
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   */
  subcommandDescription(cmd: CommandDescriptor): string {
    return cmd.summary || (cmd.description.includes('\n') ? cmd.description.split('\n')[0] : '')
  }

  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: OptionDescriptorBase): string {
    const extraInfo: string[] = []

    if (option.choices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.choices.map((choice: string) => String(choice)).join(', ')}`,
      )
    }
    if (option.defaultValue !== undefined) {
      const boolean = !option.required && !option.optional && !option.negate
      // default for boolean and negated more for programmer than end user,
      // but show true/false for boolean option as may be for hand-rolled env or config processing.
      const showDefault =
        option.required || option.optional || (boolean && typeof option.defaultValue === 'boolean')
      if (showDefault) {
        extraInfo.push(`default: ${option.defaultValueDescription || String(option.defaultValue)}`)
      }
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

    return option.description
  }

  /**
   * Get the argument description to show in the list of arguments.
   */
  argumentDescription(argument: ArgumentDescriptorBase): string {
    const extraInfo: string[] = []
    if (argument.choices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.choices.map((choice: string) => String(choice)).join(', ')}`,
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
    return argument.description
  }

  /**
   * Format a list of items, given a heading and an array of formatted items.
   */
  formatItemList(heading: string, items: string[], helper: Help): string[] {
    if (items.length === 0) return []

    return [helper.styleTitle(heading), ...items, '']
  }

  /**
   * Group items by their help group heading.
   */
  groupItems<T extends CommandDescriptor | OptionDescriptorBase>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]> {
    const result = new Map<string, T[]>()
    // Add groups in order of appearance in unsortedItems.
    unsortedItems.forEach((item: T) => {
      const group = getGroup(item)
      if (!result.has(group)) result.set(group, [])
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
   * Generate the built-in help text.
   */
  formatHelp(cmd: CommandDescriptor, helper: IHelp): string {
    const termWidth = helper.padWidth(cmd, helper)
    const helpWidth = helper.helpWidth

    function callFormatItem(term: string, description: string): string {
      return helper.formatItem(term, termWidth, description, helper)
    }

    // Usage
    let output = [`${helper.styleTitle('Usage:')} ${helper.styleUsage(helper.commandUsage(cmd))}`, '']

    // Description
    const commandDescription = helper.commandDescription(cmd)
    if (commandDescription.length > 0) {
      output = output.concat([helper.boxWrap(helper.styleCommandDescription(commandDescription), helpWidth), ''])
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument: ArgumentDescriptorBase) => {
      return callFormatItem(
        helper.styleArgumentTerm(helper.argumentTerm(argument)),
        helper.styleArgumentDescription(helper.argumentDescription(argument)),
      )
    })
    output = output.concat(this.formatItemList('Arguments:', argumentList, helper))

    // Options
    const optionGroups = this.groupItems(
      cmd.options,
      helper.visibleOptions(cmd),
      (option: OptionDescriptorBase) => option.group ?? 'Options:',
    )
    optionGroups.forEach((options, group) => {
      const optionList = options.map((option: OptionDescriptorBase) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option)),
        )
      })
      output = output.concat(this.formatItemList(group, optionList, helper))
    })

    if (helper.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option: OptionDescriptorBase) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option)),
        )
      })
      output = output.concat(this.formatItemList('Global Options:', globalOptionList, helper))
    }

    // Commands
    const commandGroups = this.groupItems(
      cmd.commands,
      helper.visibleCommands(cmd),

      (sub: CommandDescriptor) => sub.group || 'Commands:',
    )
    commandGroups.forEach((commands, group) => {
      const commandList = commands.map((sub: CommandDescriptor) => {
        return callFormatItem(
          helper.styleSubcommandTerm(helper.subcommandTerm(sub)),
          helper.styleSubcommandDescription(helper.subcommandDescription(sub)),
        )
      })
      output = output.concat(this.formatItemList(group, commandList, helper))
    })

    return output.join('\n')
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
    return str
  }

  /**
   * Style the usage line for displaying in the help. Applies specific styling to different parts like options, commands, and arguments.
   */
  styleUsage(str: string): string {
    // Usage has lots of parts the user might like to color separately! Assume default usage string which is formed like:
    //    command subcommand [options] [command] <foo> [bar]
    return str
      .split(' ')
      .map((word: string) => {
        if (word === '[options]') return this.styleOptionText(word)
        if (word === '[command]') return this.styleSubcommandText(word)
        if (word[0] === '[' || word[0] === '<') return this.styleArgumentText(word)
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
    return this.styleDescriptionText(str)
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
    return this.styleDescriptionText(str)
  }

  /**
   * Base style used by descriptions. Override in subclass to apply custom formatting.
   */
  styleDescriptionText(str: string): string {
    return str
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
    //    subcommand [options] <foo> [bar]
    return str
      .split(' ')
      .map((word: string) => {
        if (word === '[options]') return this.styleOptionText(word)
        if (word[0] === '[' || word[0] === '<') return this.styleArgumentText(word)
        return this.styleSubcommandText(word) // Restrict to initial words?
      })
      .join(' ')
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
  padWidth(cmd: CommandDescriptor, helper: Help): number {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper),
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
  formatItem(term: string, termWidth: number, description: string, helper: Help): string {
    const itemIndent = 2
    const itemIndentStr = ' '.repeat(itemIndent)
    if (!description) return itemIndentStr + term

    // Pad the term out to a consistent width, so descriptions are aligned.
    const paddedTerm = term.padEnd(termWidth + term.length - helper.displayWidth(term))

    // Format the description.
    const spacerWidth = 2 // between term and description
    const helpWidth = this.helpWidth
    const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent
    let formattedDescription: string
    if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
      formattedDescription = description
    } else {
      const wrappedDescription = helper.boxWrap(description, remainingWidth)
      formattedDescription = wrappedDescription.replace(/\n/g, '\n' + ' '.repeat(termWidth + spacerWidth))
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
    if (width < this.minWidthToWrap) return str

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
}

export interface IHelp {
  helpWidth: number
  minWidthToWrap: number
  sortSubcommands?: boolean
  sortOptions?: boolean
  showGlobalOptions?: boolean

  subcommandTerm(cmd: CommandDescriptor): string
  subcommandDescription(cmd: CommandDescriptor): string
  optionTerm(option: OptionDescriptorBase): string
  optionDescription(option: OptionDescriptorBase): string
  argumentTerm(argument: ArgumentDescriptorBase): string
  argumentDescription(argument: ArgumentDescriptorBase): string
  commandUsage(cmd: CommandDescriptor): string
  commandDescription(cmd: CommandDescriptor): string
  visibleCommands(cmd: CommandDescriptor): CommandDescriptor[]
  visibleOptions(cmd: CommandDescriptor): OptionDescriptorBase[]
  visibleGlobalOptions(cmd: CommandDescriptor): OptionDescriptorBase[]
  visibleArguments(cmd: CommandDescriptor): ArgumentDescriptorBase[]
  longestSubcommandTermLength(cmd: CommandDescriptor, helper: IHelp): number
  longestOptionTermLength(cmd: CommandDescriptor, helper: IHelp): number
  longestGlobalOptionTermLength(cmd: CommandDescriptor, helper: IHelp): number
  longestArgumentTermLength(cmd: CommandDescriptor, helper: IHelp): number
  displayWidth(str: string): number
  styleTitle(title: string): string
  styleUsage(str: string): string
  styleCommandText(str: string): string
  styleCommandDescription(str: string): string
  styleOptionDescription(str: string): string
  styleSubcommandDescription(str: string): string
  styleArgumentDescription(str: string): string
  styleDescriptionText(str: string): string
  styleOptionTerm(str: string): string
  styleSubcommandTerm(str: string): string
  styleArgumentTerm(str: string): string
  styleOptionText(str: string): string
  styleSubcommandText(str: string): string
  styleArgumentText(str: string): string
  compareOptions(a: OptionDescriptorBase, b: OptionDescriptorBase): number
  padWidth(cmd: CommandDescriptor, helper: IHelp): number
  boxWrap(str: string, width: number): string
  preformatted(str: string): boolean
  formatItem(term: string, termWidth: number, description: string, helper: IHelp): string
  formatItemList(heading: string, items: string[], helper: IHelp): string[]
  groupItems<T extends CommandDescriptor | OptionDescriptorBase>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]>
  formatHelp(cmd: CommandDescriptor, helper: IHelp): string
}
