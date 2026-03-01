import type { Choice } from 'prompts'
import type { ChoiceMeta } from './types'
import type { FsChoiceMeta } from './types'
import type { PromptObject } from 'prompts'
import { regexEscapeString } from '@bemoje/regex'

const choicesSeen = new WeakSet<PromptObject>()

export interface SuggestOptions {
  caseInsensitive: boolean
  regexMode: boolean
}

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

export function regExact(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(`^${opts.regexMode ? kw : regexEscapeString(kw)}$`, regCaseFlag)
  } catch (_) {
    return new RegExp(`^${regexEscapeString(kw)}$`, regCaseFlag)
  }
}
export function regStartsWith(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(`^${opts.regexMode ? kw : regexEscapeString(kw)}`, regCaseFlag)
  } catch (_) {
    return new RegExp(`^${regexEscapeString(kw)}`, regCaseFlag)
  }
}
export function regIncludes(opts: SuggestOptions, kw: string) {
  const regCaseFlag = opts.caseInsensitive ? 'i' : ''
  try {
    return new RegExp(opts.regexMode ? kw : regexEscapeString(kw), regCaseFlag)
  } catch (_) {
    return new RegExp(regexEscapeString(kw), regCaseFlag)
  }
}
