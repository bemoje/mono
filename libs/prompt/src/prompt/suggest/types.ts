import type { Choice } from 'prompts'
import type { IChoice } from '../additions/searchPrompt/core/IChoice'
import type { PromptObject } from 'prompts'

export type { Choice, PromptObject }

export interface Meta {
  index: number
  words: string[]
  origTitle: string
}

export type ChoiceMeta = IChoice<string> & { meta: Meta }

export interface FsMeta extends Meta {
  isDir: boolean
}

export type FsChoiceMeta = IChoice<string> & { meta: FsMeta }
