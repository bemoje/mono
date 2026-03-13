import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { IAutocompletePrompt } from './types'
import type { ISearchPromptFilteringOptions } from '../additions/searchPrompt/core/ISearchPromptFilteringOptions'
import type { ISearchPromptOptions } from '../additions/searchPrompt/core/ISearchPromptOptions'
import type { ISearchPromptResult } from '../additions/searchPrompt/core/ISearchPromptResult'
import type { Options as PromptsOptions } from 'prompts'
import type { TFormat } from './types'
import type { TStyle } from './types'
import { searchPrompt } from '../additions/searchPrompt/searchPrompt'

/**
 * Interactive autocomplete user prompts in the terminal.
 */
export class SearchPrompt<T extends string = string> extends AbstractUserPrompt<
  IAutocompletePrompt<T>,
  ISearchPromptResult
> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('autocomplete', message)
  }

  /**
   * An array of options/choices for the user to select.
   */
  choices(data: string[]) {
    Object.defineProperty(this.data, 'choices', { value: ['>>'].concat(data) })
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
   * The first ESCAPE keypress will clear the input
   */
  clearFirst(clearFirst = true) {
    this.data.clearFirst = clearFirst
    return this
  }

  /**
   * Max number of results to show. Defaults to 25
   */
  limit(limit = 25) {
    this.data.limit = limit
    return this
  }

  /**
   * The delimiter to use to split the user input into keywords.
   * Defaults to ' ' (space).
   */
  separator(delim = ' ') {
    this.data.separator = delim
    return this
  }

  /**
   * When this string is encountered, the input coming after will not be considered for searching. Defaults to ':'
   */
  searchStopSequence(stop: string) {
    Object.defineProperty(this.data, 'searchStopSequence', { value: stop })
    return this
  }

  /**
   * Filtering options.
   */
  filtering(filtering: ISearchPromptFilteringOptions) {
    Object.defineProperty(this.data, 'filtering', { value: filtering })
    return this
  }

  /**
   * A function to pre-render each string in the search data before searching has begun.
   * This is useful if the same string formatting will be applied to all returned search results.
   *
   * @param original - The original (or pre-rendered) string.
   */
  preRender(preRender: (original: string[]) => string[]) {
    Object.defineProperty(this.data, 'preRender', { value: preRender })
    return this
  }

  /**
   * A function to render the search results.
   *
   * @param original - The original (or pre-rendered) string.
   * @param keywords - The keywords that matched the original string.
   */
  render(render: (original: string[], keywords: string[]) => string) {
    Object.defineProperty(this.data, 'render', { value: render })
    return this
  }

  /**
   * Receive user input. The returned value will be added to the response object
   */
  format(format: TFormat<T>) {
    this.data.format = format
    return this
  }

  /**
   * Render style
   */
  style(style: TStyle = 'default') {
    this.data.style = style
    return this
  }

  override async run(options?: PromptsOptions) {
    const rval = await searchPrompt(
      this.data.choices as unknown as string[],
      this.data as ISearchPromptOptions,
      options
    )
    return rval
  }
}
