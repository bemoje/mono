import { strIsLowerCase } from './strIsLowerCase'
import { strIsUpperCase } from './strIsUpperCase'

/**
 * Returns an array of words in the string
 * @param word The camel case word to split.
 * @throws Throws an error if the input is not a string.
 * @param input input string
 * @example ```ts
 * strSplitCamelCase('someCamel10Case')
 * //=> ['some', 'Camel10', 'Case']
 * ```
 */
export function strSplitCamelCase(word: string): string[] {
  if (!word) return []
  if (word.length <= 2) return [word]
  const result: string[] = []
  const lastCharIndex = word.length - 1
  let lastSplitIndex = 0
  let foundCamelCase = false
  for (let i = 1; i < word.length; i++) {
    if (isWordSplitIndex(word, i)) {
      const sub = word.substring(lastSplitIndex, i)
      if (sub) {
        result.push(sub)
        lastSplitIndex = i
        foundCamelCase = true
      }
    }
    if (foundCamelCase && i === lastCharIndex) {
      const sub = word.substring(lastSplitIndex)
      if (sub) result.push(sub)
    }
  }
  if (!foundCamelCase) result.push(word)
  return result
}

const regInteger = /\d+/g
const regSpecial = /[^\w]+/g

function isWordSplitIndex(word: string, index: number) {
  return (
    strIsLowerCase(word[index - 1]) &&
    strIsUpperCase(word[index]) &&
    !regInteger.test(word[index - 1]) &&
    !regInteger.test(word[index]) &&
    !regSpecial.test(word[index - 1]) &&
    !regSpecial.test(word[index])
  )
}
