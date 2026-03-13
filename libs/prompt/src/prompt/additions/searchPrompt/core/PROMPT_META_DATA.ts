import type { ISearchPromptMetaData } from './ISearchPromptMetaData'
import type { PromptObject } from 'prompts'

/**
 * WeakMap storing search prompt meta data associated with each prompt object.
 */
export const PROMPT_META_DATA = new WeakMap<PromptObject, ISearchPromptMetaData>()
