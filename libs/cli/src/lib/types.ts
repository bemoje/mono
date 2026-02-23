/** Parsed command-line arguments */
export type Arguments = (undefined | string | string[])[]

/** Parsed command-line options */
export type Options = Record<string, undefined | boolean | string | string[]>

/** Base descriptor for command-line arguments with shared properties */
export interface IArgument {
  usage: string
  name: string
  description?: string
  required?: boolean
  variadic?: boolean
  choices?: string[]
  defaultValue?: string | string[]
  defaultValueDescription?: string
}

/** Base descriptor for command-line options with shared properties */
export interface IOption {
  type: 'boolean' | 'string'
  flags: string
  short: string
  long: string
  name: string
  argName?: string
  description: string
  required?: boolean
  variadic?: boolean
  negate?: boolean
  defaultValue?: boolean | string | string[]
  defaultValueDescription?: string
  env?: string
  hidden?: boolean
  choices?: string[]
  group?: string
}

/** Complete command configuration including all properties and substructures */
export interface ICommand {
  /** Parent command if this is a subcommand */
  readonly parent?: ICommand
  /** Help configuration and rendering */
  readonly help: IHelp
  /** Command name used for invocation */
  name: string
  /** Alternative names for this command */
  aliases: string[]
  /** Optional version string */
  version?: string
  /** Full command description */
  description: string
  /** Brief single-line description */
  summary?: string
  /** Whether command should be hidden from help */
  hidden?: boolean
  /** Group name for organizing commands in help */
  group?: string
  /** Positional arguments */
  arguments: IArgument[]
  /** Named options/flags */
  options: IOption[]
  /** Child subcommands */
  commands: ICommand[]
}

export interface IHelp {
  /** output helpWidth, long lines are wrapped to fit */
  helpWidth: number
  minWidthToWrap: number
  sortSubcommands: boolean
  sortOptions: boolean
  usageDisplayOptionsAs: string
  usageDisplaySubcommandAs: string
  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  visibleCommands(): ICommand[]
  /**
   * Compare options for sort.
   */
  compareOptions(a: IOption, b: IOption): number
  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  visibleOptions(): IOption[]
  /**
   * Get an array of the arguments if any have a description.
   */
  visibleArguments(): IArgument[]
  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(sub: ICommand): string
  /**
   * Get the option term to show in the list of options.
   */
  optionTerm(option: IOption): string
  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: IArgument): string
  /**
   * Get the longest subcommand primary alias length.
   */
  longestSubcommandAliasLength(): number
  /**
   * Get the longest subcommand term length.
   */
  longestSubcommandTermLength(): number
  /**
   * Get the longest option term length.
   */
  longestOptionTermLength(): number
  /**
   * Get the longest argument term length.
   */
  longestArgumentTermLength(): number
  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(): string
  /**
   * Get the description for the command.
   */
  commandDescription(): string
  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   */
  subcommandDescription(sub: ICommand): string
  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: IOption): string
  /**
   * Get the argument description to show in the list of arguments.
   */
  argumentDescription(argument: IArgument): string
  /**
   * Format a list of items, given a heading and an array of formatted items.
   */
  formatItemList(heading: string, items: string[]): string[]
  /**
   * Group items by their help group heading.
   */
  groupItems<T extends ICommand | IOption>(
    unsortedItems: T[],
    visibleItems: T[],
    getGroup: (item: T) => string,
  ): Map<string, T[]>
  /**
   * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
   */
  displayWidth(str: string): number
  /**
   * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
   */
  styleTitle(str: string): string
  /**
   * Style the usage line for displaying in the help. Applies specific styling to different parts like options, commands, and arguments.
   */
  styleUsage(str: string): string
  /**
   * Style command descriptions for display in help output.
   */
  styleCommandDescription(str: string): string
  /**
   * Style option descriptions for display in help output.
   */
  styleOptionDescription(str: string): string
  /**
   * Style subcommand descriptions for display in help output.
   */
  styleSubcommandDescription(str: string): string
  /**
   * Style argument descriptions for display in help output.
   */
  styleArgumentDescription(str: string): string
  /**
   * Base style used by descriptions. Override in subclass to apply custom formatting.
   */
  styleDescriptionText(str: string): string
  /**
   * Style option terms (flags) for display in help output.
   */
  styleOptionTerm(str: string): string
  /**
   * Style subcommand terms for display in help output. Applies specific styling to different parts like options and arguments.
   */
  styleSubcommandTerm(str: string): string
  /**
   * Style argument terms for display in help output.
   */
  styleArgumentTerm(str: string): string
  /**
   * Base style used in terms and usage for options. Override in subclass to apply custom formatting.
   */
  styleOptionText(str: string): string
  /**
   * Base style used in terms and usage for arguments. Override in subclass to apply custom formatting.
   */
  styleArgumentText(str: string): string
  /**
   * Base style used in terms and usage for subcommands. Override in subclass to apply custom formatting.
   */
  styleSubcommandText(str: string): string
  /**
   * Base style used in terms and usage for commands. Override in subclass to apply custom formatting.
   */
  styleCommandText(str: string): string
  /**
   * Calculate the pad width from the maximum term length.
   */
  padWidth(): number
  /**
   * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
   */
  preformatted(str: string): boolean
  /**
   * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
   *
   * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
   *   TTT  DDD DDDD
   *        DD DDD
   */
  formatItem(term: string, termWidth: number, description: string): string
  /**
   * Wrap a string at whitespace, preserving existing line breaks.
   * Wrapping is skipped if the width is less than `minWidthToWrap`.
   */
  boxWrap(str: string, width: number): string
  /**
   * Generate the built-in help text.
   */
  render(): string
}
