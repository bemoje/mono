import type { ISearchPromptMetaData } from './ISearchPromptMetaData'
import { PROMPT_META_DATA } from './PROMPT_META_DATA'
import type { PromptObject } from 'prompts'

/**
 * Retrieve the search prompt meta data associated with the given prompt object.
 *
 * @param prompt - The prompt object to get meta data for.
 * @throws If no meta data is found for the given prompt.
 */
export function getSearchPromptMetaData(prompt: PromptObject): ISearchPromptMetaData {
  const result = PROMPT_META_DATA.get(prompt)
  if (!result) {
    throw new Error('Prompt meta data not found.')
  }
  return result
}
