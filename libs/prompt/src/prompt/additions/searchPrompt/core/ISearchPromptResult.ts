import type { ISearchPromptMetaData } from './ISearchPromptMetaData'

export interface ISearchPromptResult {
  input: string
  matches: string[]
  selected: string
  metadata: ISearchPromptMetaData
}
