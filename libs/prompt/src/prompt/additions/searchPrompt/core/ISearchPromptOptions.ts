import type { ISearchPromptFilteringOptions } from './ISearchPromptFilteringOptions'

export interface ISearchPromptOptions {
  /**
   * The maximum number of search results to show simultanously on the command line.
   * Defaults to 15.
   */
  limit?: number

  /**
   * The delimiter to use to split the user input into keywords.
   * Defaults to ' ' (space).
   */
  separator?: string

  /**
   * Return this default value if the user enters nothing.
   */
  initial?: string

  /**
   * When this string is encountered, the input coming after will not be considered for searching. Defaults to ':'
   */
  searchStopSequence?: string

  /**
   * When using multiple keyword delimiters, this string can be used to separate keywords that should be treated as an "or" condition instead of "and". For example, if the separator is a space and the searchOrUnion is '|', then the input "foo bar || baz" would search for items that match "foo" AND "bar" OR "baz".
   * Defaults to '|'
   */
  searchOrUnion?: string

  /**
   * Filtering options.
   */
  filtering?: ISearchPromptFilteringOptions

  /**
   * A function to pre-render each string in the search data before searching has begun.
   * This is useful if the same string formatting will be applied to all returned search results.
   *
   * @param original - The original (or pre-rendered) string.
   */
  preRender?: (original: string[]) => string[]

  /**
   * A function to render the search results.
   *
   * @param original - The original (or pre-rendered) string.
   * @param keywords - The keywords that matched the original string.
   */
  render?: (original: string[], keywords: string[]) => string
}
