import type { ChoiceMeta } from './types'
import type { IChoice } from '../additions/searchPrompt/core/IChoice'
import type { PromptObject } from './types'
import type { StyleFunction } from 'ansi-colors'
import type { SuggestOptions } from './common'
import colors from 'ansi-colors'
import { initChoices } from './common'
import { regExact } from './common'
import { regIncludes } from './common'
import { regStartsWith } from './common'

export async function suggestDefault(this: PromptObject, input: string, choices: IChoice<string>[]) {
  const opts: SuggestOptions = { caseInsensitive: true, regexMode: false }
  const keywords = input.split(' ')
  if (keywords[0].startsWith('!')) {
    if (keywords[0].includes('I')) {
      opts.caseInsensitive = true
    } else if (keywords[0].includes('R')) {
      opts.regexMode = true
    }
    keywords.shift()
  }
  const data = initChoices<ChoiceMeta>(this, choices)

  if (!input.trim()) {
    return data.slice(0, 100).map((choice) => {
      choice.title = colors.gray.dim(choice.title)
      return choice
    })
  }

  const result: ChoiceMeta[] = [data[0]]

  getResult(result, opts, data, keywords, colors.bold.red, regExact)
  getResult(result, opts, data, keywords, colors.bold.magenta, regStartsWith)
  getResult(result, opts, data, keywords, colors.bold.cyan, regIncludes)

  data.forEach((choice) => {
    if (!result.includes(choice)) {
      choice.title = colors.dim.gray(choice.title)
      result.push(choice)
    }
  })

  return result
}

function getResult(
  result: ChoiceMeta[],
  opts: SuggestOptions,
  data: ChoiceMeta[],
  keywords: string[],
  color: StyleFunction,
  regex: (opts: SuggestOptions, kw: string) => RegExp
) {
  const s = data.filter((choice) => {
    return keywords.every((kw) => {
      return choice.meta.words.some((word) => {
        return regex(opts, kw).test(word)
      })
    })
  })
  s.forEach((choice) => {
    if (!result.includes(choice)) {
      choice.title.replace(regex(opts, keywords.join('|')), (match) => {
        return color(match)
      })
      result.push(choice)
    }
  })
}
