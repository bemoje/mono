import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { IAutocompleteMultiselectPrompt } from './types'
import type { IChoice } from '../additions/searchPrompt/core/IChoice'
import type { TOnRender } from './types'
import type { TSuggest } from './types'
import { suggestDefault } from '../suggest/suggestDefault'

/**
 * Interactive multiselect user prompts in the terminal.
 */
export class AutocompleteMultiselectPrompt<
  T extends string | number | boolean = number,
> extends AbstractUserPrompt<IAutocompleteMultiselectPrompt<string>, string[]> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('autocompleteMultiselect', message)
    this.suggest(suggestDefault)
    this.limit(40)
  }

  /**
   * On render callback. Keyword this refers to the current prompt
   */
  onRender(onRender: TOnRender) {
    this.data.onRender = onRender
    return this
  }

  /**
   * Default value
   */
  initial(initial: T) {
    this.data.initial = initial
    return this
  }

  /**
   * Prompt instructions to display
   */
  instructions(instructions: string) {
    this.data.instructions = instructions
    return this
  }

  /**
   * Max number of results to show. Defaults to 10
   */
  limit(limit: number) {
    this.data.limit = limit
    return this
  }

  /**
   * Hint to display to the user
   */
  hint(hint: string) {
    this.data.hint = hint
    return this
  }

  /**
   * Message to display when selecting a disabled option
   */
  warn(warn: string) {
    this.data.warn = warn
    return this
  }

  /**
   * An array of options/choices for the user to select.
   */
  choices(choices: string[]): this
  choices(choices: Omit<IChoice<string>, 'value'>[]): this
  choices(choices: string[] | Omit<IChoice<string>, 'value'>[]) {
    this.data.choices = choices.map((choice) => {
      if (typeof choice === 'string') {
        return { title: choice, value: choice }
      } else {
        const res = { value: choice.title, ...choice }
        return res
      }
    })
    this.data.choices.unshift({ title: '>>', value: '' })
    return this
  }

  /**
   * Number of options displayed per page.
   */
  optionsPerPage(optionsPerPage = 10) {
    this.data.optionsPerPage = optionsPerPage
    return this
  }

  /**
   * Minimum number of choices to select - will display error.
   */
  min(min: number) {
    this.data.min = min
    return this
  }

  /**
   * Maximum number of choices to select
   */
  max(max: number) {
    this.data.max = max
    return this
  }

  /**
   * Filter function. Defaults to sort by title property. suggest should always return a promise. Filters using title by default
   */
  suggest(suggest: TSuggest<string>) {
    this.data.suggest = suggest
    return this
  }
}
