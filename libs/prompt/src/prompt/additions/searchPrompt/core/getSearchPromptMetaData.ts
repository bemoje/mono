import type { ISearchPromptMetaData } from './ISearchPromptMetaData'
import { PROMPT_META_DATA } from './PROMPT_META_DATA'
import type { PromptObject } from 'prompts'

export function getSearchPromptMetaData(prompt: PromptObject): ISearchPromptMetaData {
  const result = PROMPT_META_DATA.get(prompt)
  if (!result) {throw new Error('Prompt meta data not found.')}
  return result
}
