import type { ISearchPromptMetaData } from './ISearchPromptMetaData'
import type { PromptObject } from 'prompts'

export const PROMPT_META_DATA = new WeakMap<PromptObject, ISearchPromptMetaData>()
