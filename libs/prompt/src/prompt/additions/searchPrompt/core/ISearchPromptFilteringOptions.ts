export interface ISearchPromptFilteringOptions {
  /**
   * If true, then the search results will include keyword-matches that match anywhere in the string. Defaults to 'true'
   */
  includes?: boolean
  /**
   * If true, then the search results will include beginning-of-word-matches. Defaults to 'true'
   */
  startsWith?: boolean
  /**
   * If true, letter casing is ignored. Defaults to 'true'.
   */
  caseSensitive?: boolean
}
