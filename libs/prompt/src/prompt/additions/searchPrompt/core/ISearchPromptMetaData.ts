import type { Choice } from 'prompts'

export interface ISearchPromptMetaData {
  input: string
  inputAfterStop: string
  originalInput: string
  keywords: string[]
  result: Choice[]
}
