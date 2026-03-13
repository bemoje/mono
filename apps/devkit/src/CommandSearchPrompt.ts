import type { Argument } from '@mono/cli'
import type { Choice } from 'prompts'
import type { ISearchPromptResult } from '@mono/prompt'
import type { Option } from '@mono/cli'
import type { PromptObject } from 'prompts'
import type { Options as PromptsOptions } from 'prompts'
import { SearchPrompt } from '@mono/prompt'
import colors from 'ansi-colors'
import prompts from 'prompts'

export const DONE_VALUE = '__done__'

/**
 * A search prompt that dynamically suggests options or argument choices
 * based on the input prefix:
 * - `--` prefix: suggests matching long option flags
 * - `-` prefix: suggests matching short option flags
 * - no prefix: suggests argument choices (if available) and allows free text
 */
export class CommandSearchPrompt extends SearchPrompt {
  private _cmdArguments: Argument[] = []
  private _cmdOptions: Option[] = []
  private _argIndex = 0
  private _filledArgv: string[] = []

  commandArguments(args: Argument[]) {
    this._cmdArguments = args
    return this
  }

  commandOptions(opts: Option[]) {
    this._cmdOptions = opts
    return this
  }

  argIndex(index: number) {
    this._argIndex = index
    return this
  }

  filledArgv(argv: string[]) {
    this._filledArgv = argv
    return this
  }

  override async run(options?: PromptsOptions): Promise<ISearchPromptResult> {
    const allChoices = this.buildChoices()
    const name = this.data.name || 'value'
    const message = this.buildMessage()

    interface PromptObjectWithClearFirst extends PromptObject {
      clearFirst: boolean
    }

    const promptObj: PromptObjectWithClearFirst = {
      type: 'autocomplete',
      name,
      message,
      limit: this.data.limit ?? 50,
      clearFirst: true,
      choices: allChoices,
      suggest: async (input: string): Promise<Choice[]> => {
        return this.contextSuggest(String(input), allChoices)
      },
    }

    const result = await prompts(promptObj, options)
    const selected = (result[name] as string) ?? ''
    return {
      input: selected,
      matches: [],
      selected,
      metadata: { input: selected, inputAfterStop: '', originalInput: selected, keywords: [], result: [] },
    }
  }

  private buildMessage(): string {
    const parts: string[] = []

    // Show what's been collected so far
    if (this._filledArgv.length) {
      parts.push(colors.gray(this._filledArgv.join(' ')))
    }

    // Show all arguments with context: filled (green), current (red/cyan), future (gray)
    for (let i = 0; i < this._cmdArguments.length; i++) {
      const arg = this._cmdArguments[i]
      if (i < this._argIndex) {
        // Already filled - show as dim/green
        parts.push(colors.dim.green(arg.usage))
      } else if (i === this._argIndex) {
        // Currently filling - highlight
        parts.push(arg.required ? colors.red(arg.usage) : colors.blue(arg.usage))
      } else {
        // Future - show as dim
        parts.push(colors.dim(arg.usage))
      }
    }

    if (this._cmdOptions.length) {
      parts.push(colors.gray(`[${this._cmdOptions.length} opts]`))
    }

    return parts.join(' ')
  }

  private hasRequiredUnfilledArgs(): boolean {
    for (let i = this._argIndex; i < this._cmdArguments.length; i++) {
      if (this._cmdArguments[i].required) {
        return true
      }
    }
    return false
  }

  private buildChoices(): Choice[] {
    const choices: Choice[] = []

    // Only show [done] if all required args have been filled
    if (!this.hasRequiredUnfilledArgs()) {
      choices.push({ title: colors.green('>>'), value: DONE_VALUE })
    }

    // Show argument choices for current position first (most relevant)
    const arg = this._cmdArguments[this._argIndex]
    if (arg?.choices?.length) {
      for (const c of arg.choices) {
        choices.push({ title: c, value: c, description: colors.gray(arg.description ?? '') })
      }
    } else if (arg) {
      // No predefined choices - show free text hint
      choices.push({
        title: arg.usage,
        value: '',
        description: colors.gray(arg.description ?? ''),
        disabled: true,
      })
    }

    // Then show options
    for (const opt of this._cmdOptions) {
      choices.push({ title: opt.flags, value: `--${opt.long}`, description: opt.description ?? '' })
    }

    return choices
  }

  private contextSuggest(input: string, allChoices: Choice[]): Choice[] {
    const trimmed = input.trim()
    if (!trimmed) {
      return allChoices
    }

    const doneChoices = allChoices.filter((c) => {
      return c.value === DONE_VALUE
    })

    if (trimmed.startsWith('--')) {
      return [...doneChoices, ...this.filterLongOptions(trimmed.slice(2), allChoices)]
    }

    if (trimmed.startsWith('-')) {
      return [...doneChoices, ...this.filterShortOptions(trimmed.slice(1), allChoices)]
    }

    return [...doneChoices, ...this.filterArgChoices(trimmed, allChoices)]
  }

  private filterLongOptions(query: string, allChoices: Choice[]): Choice[] {
    const q = query.toLowerCase()
    return allChoices.filter((c) => {
      const val = String(c.value ?? '')
      if (!val.startsWith('--')) {
        return false
      }
      return val.slice(2).toLowerCase().includes(q)
    })
  }

  private filterShortOptions(query: string, allChoices: Choice[]): Choice[] {
    const q = query.toLowerCase()
    return allChoices.filter((c) => {
      const val = String(c.value ?? '')
      if (!val.startsWith('--')) {
        return false
      }
      const opt = this._cmdOptions.find((o) => {
        return `--${o.long}` === val
      })
      if (!opt?.short) {
        return false
      }
      return opt.short.toLowerCase().includes(q)
    })
  }

  private filterArgChoices(query: string, allChoices: Choice[]): Choice[] {
    const q = query.toLowerCase()
    const matches = allChoices.filter((c) => {
      const val = String(c.value ?? '')
      if (val === DONE_VALUE || val.startsWith('--')) {
        return false
      }
      return c.title.toLowerCase().includes(q)
    })

    // Allow free text input when the current argument position is valid
    if (this._argIndex < this._cmdArguments.length) {
      const freeText: Choice = { title: query, value: query, description: '' }
      return [freeText, ...matches]
    }

    return matches
  }
}
