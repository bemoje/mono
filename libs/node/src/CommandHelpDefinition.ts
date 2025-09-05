/**
 * Although this is a class, methods are static in style to allow override using subclass or just functions.
 */
export class CommandHelpDefinition implements ICommandHelpDefinition {
  /** output helpWidth, long lines are wrapped to fit */
  helpWidth: number = process.stdout.isTTY ? process.stdout.columns : 80
  minWidthToWrap: number = 40
  sortSubcommands?: boolean
  sortOptions?: boolean
  showGlobalOptions?: boolean

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  visibleCommands(cmd: CommandHelp): CommandHelp[] {
    const visibleCommands = cmd.commands.filter((cmd: CommandHelp) => !cmd.hidden)

    if (this.sortSubcommands) {
      visibleCommands.sort((a: CommandHelp, b: CommandHelp) => {
        return a.name.localeCompare(b.name)
      })
    }
    return visibleCommands
  }

  /**
   * Compare options for sort.
   */
  compareOptions(a: OptionHelp, b: OptionHelp): number {
    const getSortKey = (option: OptionHelp): string => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long!.replace(/^--/, '')
    }
    return getSortKey(a).localeCompare(getSortKey(b))
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  visibleOptions(cmd: CommandHelp): OptionHelp[] {
    const visibleOptions = cmd.options.filter((option: OptionHelp) => !option.hidden)

    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions)
    }
    return visibleOptions
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   */
  visibleGlobalOptions(cmd: CommandHelp): OptionHelp[] {
    if (!this.showGlobalOptions) return []

    const globalOptions: OptionHelp[] = cmd.options.filter((option) => !option.hidden)
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      const visibleOptions = ancestorCmd.options.filter((option: OptionHelp) => !option.hidden)
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
  visibleArguments(cmd: CommandHelp): ArgumentHelp[] {
    // If there are any arguments with a description then return all the arguments.
    if (cmd.arguments.find((argument: ArgumentHelp) => argument.description)) {
      return [...cmd.arguments]
    }
    return []
  }

  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(cmd: CommandHelp): string {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd.arguments.map((arg: ArgumentHelp) => humanReadableArgName(arg)).join(' ')
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
  optionTerm(option: OptionHelp): string {
    return option.flags
  }

  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: ArgumentHelp): string {
    return argument.name
  }

  /**
   * Get the longest command term length.
   */
  longestSubcommandTermLength(cmd: CommandHelp, helper: CommandHelpDefinition): number {
    return helper.visibleCommands(cmd).reduce((max: number, command: CommandHelp) => {
      return Math.max(max, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command))))
    }, 0)
  }

  /**
   * Get the longest option term length.
   */
  longestOptionTermLength(cmd: CommandHelp, helper: CommandHelpDefinition): number {
    return helper.visibleOptions(cmd).reduce((max: number, option: OptionHelp) => {
      return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))))
    }, 0)
  }

  /**
   * Get the longest global option term length.
   */
  longestGlobalOptionTermLength(cmd: CommandHelp, helper: CommandHelpDefinition): number {
    return helper.visibleGlobalOptions(cmd).reduce((max: number, option: OptionHelp) => {
      return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))))
    }, 0)
  }

  /**
   * Get the longest argument term length.
   */
  longestArgumentTermLength(cmd: CommandHelp, helper: CommandHelpDefinition): number {
    return helper.visibleArguments(cmd).reduce((max: number, argument: ArgumentHelp) => {
      return Math.max(max, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))))
    }, 0)
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(cmd: CommandHelp): string {
    // Usage
    let cmdName = cmd.name
    if (cmd.aliases[0]) {
      cmdName = cmdName + '|' + cmd.aliases[0]
    }
    let ancestorCmdNames = ''
    for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
      ancestorCmdNames = ancestorCmd.name + ' ' + ancestorCmdNames
    }
    return ancestorCmdNames + cmdName + ' ' + cmd.usage
  }

  /**
   * Get the description for the command.
   */
  commandDescription(cmd: CommandHelp): string {
    return cmd.description
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   */
  subcommandDescription(cmd: CommandHelp): string {
    return cmd.summary || cmd.description
  }

  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: OptionHelp): string {
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
  argumentDescription(argument: ArgumentHelp): string {
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
  formatItemList(heading: string, items: string[], helper: CommandHelpDefinition): string[] {
    if (items.length === 0) return []

    return [helper.styleTitle(heading), ...items, '']
  }

  /**
   * Group items by their help group heading.
   */
  groupItems<T extends CommandHelp | OptionHelp>(
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
  formatHelp(cmd: CommandHelp, helper: ICommandHelpDefinition): string {
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
    const argumentList = helper.visibleArguments(cmd).map((argument: ArgumentHelp) => {
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
      (option: OptionHelp) => option.group ?? 'Options:',
    )
    optionGroups.forEach((options, group) => {
      const optionList = options.map((option: OptionHelp) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option)),
        )
      })
      output = output.concat(this.formatItemList(group, optionList, helper))
    })

    if (helper.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option: OptionHelp) => {
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

      (sub: CommandHelp) => sub.group || 'Commands:',
    )
    commandGroups.forEach((commands, group) => {
      const commandList = commands.map((sub: CommandHelp) => {
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
    return stripColor(str).length
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
  padWidth(cmd: CommandHelp, helper: CommandHelpDefinition): number {
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
  formatItem(term: string, termWidth: number, description: string, helper: CommandHelpDefinition): string {
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

/**
 * Strip style ANSI escape sequences from the string. In particular, SGR (Select Graphic Rendition) codes.
 */
export function stripColor(str: string): string {
  // eslint-disable-next-line no-control-regex
  const sgrPattern = /\x1b\[\d*(;\d*)*m/g
  return str.replace(sgrPattern, '')
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 */
export function humanReadableArgName(arg: ArgumentHelp): string {
  const nameOutput = arg.name + (arg.variadic === true ? '...' : '')

  return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']'
}

export type CommandHelp = {
  name: string
  aliases: string[]
  summary?: string
  description: string
  hidden?: boolean
  usage: string
  group?: string
  commands: CommandHelp[]
  options: OptionHelp[]
  arguments: ArgumentHelp[]
  parent?: CommandHelp | null
  helpConfiguration?: Partial<ICommandHelpDefinition>
}

export type ArgumentHelp = {
  name: string
  description: string
  required: boolean
  variadic: boolean
  defaultValue?: string | string[]
  defaultValueDescription?: string
  choices?: string[]
}

export type OptionHelp = {
  group?: string
  flags: string
  description: string
  short: string
  long: string
  required?: boolean
  optional?: boolean
  variadic?: boolean
  negate?: boolean
  defaultValue?: boolean | string | string[]
  defaultValueDescription?: string
  env?: string
  choices?: string[]
  hidden?: boolean
  global?: boolean
}

export interface ICommandHelpDefinition {
  helpWidth: number
  minWidthToWrap: number
  sortSubcommands?: boolean
  sortOptions?: boolean
  showGlobalOptions?: boolean

  subcommandTerm(cmd: CommandHelp): string
  subcommandDescription(cmd: CommandHelp): string
  optionTerm(option: OptionHelp): string
  optionDescription(option: OptionHelp): string
  argumentTerm(argument: ArgumentHelp): string
  argumentDescription(argument: ArgumentHelp): string
  commandUsage(cmd: CommandHelp): string
  commandDescription(cmd: CommandHelp): string
  visibleCommands(cmd: CommandHelp): CommandHelp[]
  visibleOptions(cmd: CommandHelp): OptionHelp[]
  visibleGlobalOptions(cmd: CommandHelp): OptionHelp[]
  visibleArguments(cmd: CommandHelp): ArgumentHelp[]
  longestSubcommandTermLength(cmd: CommandHelp, helper: ICommandHelpDefinition): number
  longestOptionTermLength(cmd: CommandHelp, helper: ICommandHelpDefinition): number
  longestGlobalOptionTermLength(cmd: CommandHelp, helper: ICommandHelpDefinition): number
  longestArgumentTermLength(cmd: CommandHelp, helper: ICommandHelpDefinition): number
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
  compareOptions(a: OptionHelp, b: OptionHelp): number
  padWidth(cmd: CommandHelp, helper: ICommandHelpDefinition): number
  boxWrap(str: string, width: number): string
  preformatted(str: string): boolean
  formatItem(term: string, termWidth: number, description: string, helper: ICommandHelpDefinition): string
  formatItemList(heading: string, items: string[], helper: ICommandHelpDefinition): string[]
  groupItems<T extends CommandHelp | OptionHelp>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]>
  formatHelp(cmd: CommandHelp, helper: ICommandHelpDefinition): string
}

// /**
//  * Convert string from kebab-case to camelCase.
//  *
//  * @param {string} str
//  * @return {string}
//  * @private
//  */

// function camelcase(str: string) {
//   return str.split('-').reduce((str, word) => {
//     return str + word[0].toUpperCase() + word.slice(1)
//   })
// }

// /**
//  * Split the short and long flag out of something like '-m,--mixed <value>'
//  *
//  * @private
//  */

// function splitOptionFlags(flags: string) {
//   let shortFlag
//   let longFlag
//   // short flag, single dash and single character
//   const shortFlagExp = /^-[^-]$/
//   // long flag, double dash and at least one character
//   const longFlagExp = /^--[^-]/

//   const flagParts = flags.split(/[ |,]+/).concat('guard')
//   // Normal is short and/or long.
//   if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift()
//   if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift()
//   // Long then short. Rarely used but fine.
//   if (!shortFlag && shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift()
//   // Allow two long flags, like '--ws, --workspace'
//   // This is the supported way to have a shortish option flag.
//   if (!shortFlag && longFlagExp.test(flagParts[0])) {
//     shortFlag = longFlag
//     longFlag = flagParts.shift()
//   }

//   // Check for unprocessed flag. Fail noisily rather than silently ignore.
//   if (flagParts[0].startsWith('-')) {
//     const unsupportedFlag = flagParts[0]
//     const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`
//     if (/^-[^-][^-]/.test(unsupportedFlag))
//       throw new Error(
//         `${baseError}
// - a short flag is a single dash and a single character
//   - either use a single dash and a single character (for a short flag)
//   - or use a double dash for a long option (and can have two, like '--ws, --workspace')`,
//       )
//     if (shortFlagExp.test(unsupportedFlag))
//       throw new Error(`${baseError}
// - too many short flags`)
//     if (longFlagExp.test(unsupportedFlag))
//       throw new Error(`${baseError}
// - too many long flags`)

//     throw new Error(`${baseError}
// - unrecognised flag format`)
//   }
//   if (shortFlag === undefined && longFlag === undefined)
//     throw new Error(`option creation failed due to no flags found in '${flags}'.`)

//   return { shortFlag, longFlag }
// }
