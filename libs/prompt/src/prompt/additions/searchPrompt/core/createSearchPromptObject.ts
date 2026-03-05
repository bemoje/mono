import type { Choice } from 'prompts'
import type { ISearchPromptChoiceMetaData } from './ISearchPromptChoiceMetaData'
import type { ISearchPromptFilteringOptions } from './ISearchPromptFilteringOptions'
import type { ISearchPromptMetaData } from './ISearchPromptMetaData'
import type { ISearchPromptOptions } from './ISearchPromptOptions'
import { PROMPT_META_DATA } from './PROMPT_META_DATA'
import type { PromptObject } from 'prompts'
import colors from 'ansi-colors'

/**
 * Create a search prompt object that can be run with `prompts()` from npm package: `prompts`.
 * The point of this would be to run them in series.
 * To run run a prompt directly, use @see searchPrompt
 *
 * @param name - The name of the prompt
 * @param data - The list to search.
 * @param options - The options
 */
export function createSearchPromptObject(
  name: string,
  data: string[],
  options: ISearchPromptOptions
): PromptObject {
  const searchStopSequence = options.searchStopSequence ?? ' -- '
  const keywordDelimiter = options.separator ?? ' '
  const searchOrUnion = options.searchOrUnion ?? '|'

  const meta = new WeakMap<Choice, ISearchPromptChoiceMetaData>()
  const choices = data.map((value) => {
    const choice: Choice = { title: value, value: value }
    const parsed: string[] = strSplitBy(value, keywordDelimiter)
    const preRendered: string[] = options.preRender ? options.preRender(parsed) : parsed.slice()
    meta.set(choice, { parsed, preRendered })
    return choice
  })

  const filtering = options.filtering || {}
  if (filtering.startsWith === undefined) {
    filtering.startsWith = true
  }
  if (filtering.includes === undefined) {
    filtering.includes = true
  }
  if (filtering.caseSensitive === undefined) {
    filtering.caseSensitive = true
  }

  const lastResult: ISearchPromptMetaData = {
    originalInput: '',
    input: '',
    inputAfterStop: '',
    keywords: [],
    result: [],
  }

  const render = options.render || createRenderer(keywordDelimiter, filtering)

  interface PromptObjectWithClearFirst extends PromptObject {
    clearFirst: boolean
  }

  const prompt: PromptObjectWithClearFirst = {
    ...options,
    type: 'autocomplete',
    name: name,
    message: '0',
    limit: options.limit ?? 30,
    initial: options.initial,
    clearFirst: true,
    choices,
    suggest: async (input: string, choices: Choice[]): Promise<Choice[]> => {
      const [beforeStop, afterStop] = input.split(searchStopSequence)
      const beforeStopSplitOr = beforeStop.split(searchOrUnion)

      const result = new Set<Choice>([choices[0]])
      const allKeywords: string[] = []

      for (const part of beforeStopSplitOr) {
        const partResult = await search(
          afterStop ? [part, searchStopSequence, afterStop].join(' ') : part,
          lastResult,
          choices,
          meta,
          filtering,
          keywordDelimiter,
          searchStopSequence
        )
        partResult.forEach((choice) => {
          result.add(choice)
        })
        allKeywords.push(...lastResult.keywords)
      }

      lastResult.keywords = allKeywords
      lastResult.result = Array.from(result)

      return Array.from(result)
    },
    onRender: function () {
      const renderedTitles = new Map<string, string>()
      const choices = this.choices as Choice[]
      choices.forEach((choice: Choice) => {
        const choiceMeta = meta.get(choice)
        if (!choiceMeta) {
          return
        }
        const title = render(choiceMeta.parsed, choiceMeta.preRendered, lastResult.keywords)
        choice.title = title
        renderedTitles.set(choice.value, title)
      })
      // Also update suggestions since prompts displays from this.suggestions, not this.choices
      const suggestions = Reflect.get(this, 'suggestions') as Choice[] | undefined
      if (suggestions) {
        suggestions.forEach((s) => {
          const title = renderedTitles.get(s.value)
          if (title !== undefined) {
            s.title = title
          }
        })
      }
      Reflect.set(this, 'msg', String(lastResult.result.length))
    },
  }

  PROMPT_META_DATA.set(prompt, lastResult)
  return prompt
}

/**
 * Split string by delimiter, remove empty strings
 */
function strSplitBy(string: string, delimiter = ' '): string[] {
  return string.split(delimiter).filter((i) => {
    return !!i
  })
}

/**
 * Create a render function
 */
function createRenderer(keywordDelimiter: string, filtering: ISearchPromptFilteringOptions) {
  const iterate = (
    parsed: string[],
    preRendered: string[],
    keywords: string[],
    callback: (parsed: string, word: string, kw: string) => string
  ): string => {
    return preRendered
      .map((word: string, i) => {
        for (const kw of keywords) {
          word = callback(parsed[i], word, kw)
        }
        return word
      })
      .join(keywordDelimiter)
  }

  return (parsed: string[], preRendered: string[], keywords: string[]): string => {
    return iterate(parsed, preRendered, keywords, (parsed: string, word: string, kw: string) => {
      if (filtering.startsWith && parsed.startsWith(kw)) {
        return word.replace(kw, colors.magenta(kw))
      }
      if (filtering.includes && parsed.includes(kw)) {
        return word.replace(kw, colors.blue(kw))
      }
      return word
    })
  }
}

/**
 * Fitler/suggest/search based on user input
 */
async function search(
  input: string,
  latestData: ISearchPromptMetaData,
  choices: Choice[],
  meta: WeakMap<Choice, ISearchPromptChoiceMetaData>,
  filtering: ISearchPromptFilteringOptions,
  keywordDelimiter: string,
  searchStopSequence: string
): Promise<Choice[]> {
  const indexOfStopSequence = input.indexOf(searchStopSequence)
  latestData.originalInput = input
  latestData.input = indexOfStopSequence === -1 ? input : input.substring(0, indexOfStopSequence).trim()
  latestData.inputAfterStop =
    indexOfStopSequence === -1 ? '' : (input.split(searchStopSequence).pop()?.trim() ?? '')
  latestData.keywords = strSplitBy(latestData.input, keywordDelimiter)
  latestData.result = []
  let temp: Choice[] = []

  // Exact match always from beginning of searched strings/words
  const exactMatch = choices.find((choice) => {
    return latestData.keywords.join(' ') === choice.value
  })
  if (exactMatch) {
    latestData.result.push(exactMatch)
    return latestData.result
  }

  if (!filtering.startsWith && !filtering.includes) {
    latestData.result = choices
    return latestData.result
  }

  if (filtering.startsWith) {
    // 100% match always from beginning of searched strings/words
    choices.forEach((choice) => {
      const metaChoice = meta.get(choice)
      if (!metaChoice) {
        return
      }
      const parsed = metaChoice.parsed

      let has = someWordStartsWithEveryKw(latestData.keywords, parsed, filtering)
      if (!has && latestData.keywords.length === 1) {
        has = someWordStartsWithEveryKw(latestData.keywords[0].split(''), parsed, filtering)
      }
      if (has) {
        latestData.result.push(choice)
      } else {
        temp.push(choice)
      }
    })

    if (latestData.result.length === 1) {
      return latestData.result
    }
  } else {
    temp = temp.concat(choices)
  }

  if (filtering.includes) {
    // 100% match anywhere in the searched strings/words
    temp.forEach((choice) => {
      const metaChoice = meta.get(choice)
      if (!metaChoice) {
        return
      }
      const parsed = metaChoice.parsed
      if (everyKwInWord(latestData.keywords, parsed, filtering)) {
        latestData.result.push(choice)
      }
    })
  }

  return latestData.result
}

/**
 * Search 'startsWith'
 */
function someWordStartsWithEveryKw(
  keywords: string[],
  parsed: string[],
  filtering: ISearchPromptFilteringOptions
): boolean {
  if (!filtering.caseSensitive) {
    keywords = keywords.map((kw) => {
      return kw.toLowerCase()
    })
    parsed = parsed.map((p) => {
      return p.toLowerCase()
    })
  }
  let lastP = 0
  for (const kw of keywords) {
    let match = false
    for (let p = lastP; p < parsed.length; p++) {
      const cmd = parsed[p]
      if (cmd.startsWith(kw)) {
        lastP = p
        match = true
        break
      }
    }
    if (!match) {
      return false
    }
  }
  return true
}

/**
 * Search 'includes'
 */
function everyKwInWord(keywords: string[], parsed: string[], filtering: ISearchPromptFilteringOptions): boolean {
  if (!filtering.caseSensitive) {
    keywords = keywords.map((kw) => {
      return kw.toLowerCase()
    })
    parsed = parsed.map((p) => {
      return p.toLowerCase()
    })
  }
  return keywords.every((kw: string) => {
    return parsed.some((c: string) => {
      return c.includes(kw)
    })
  })
}
