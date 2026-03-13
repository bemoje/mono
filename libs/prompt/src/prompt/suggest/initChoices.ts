import type { Choice } from 'prompts'
import type { ChoiceMeta } from './types'
import type { FsChoiceMeta } from './types'
import type { PromptObject } from 'prompts'

const choicesSeen = new WeakSet<PromptObject>()

/**
 * Initialize choices for a prompt by attaching meta data to each choice object.
 *
 * @param obj - The prompt object.
 * @param choices - The choices to initialize.
 */
export function initChoices<T extends ChoiceMeta | FsChoiceMeta>(obj: PromptObject, choices: Choice[]) {
  if (!choicesSeen.has(obj)) {
    choicesSeen.add(obj)
    choices.forEach((choice, index) => {
      const isDir = choice.description?.startsWith('[]') ?? false
      Object.defineProperty(choice, 'meta', {
        value: { index, words: choice.title.split(' '), origTitle: choice.title, ...(isDir ? { isDir } : {}) },
        enumerable: false,
        configurable: true,
        writable: true,
      })
    })
  }
  return (choices as T[]).map((choice) => {
    choice.title = choice.meta.origTitle
    return choice
  })
}
