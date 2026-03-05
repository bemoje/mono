import colors from 'ansi-colors'
import { escapeRegExp } from 'es-toolkit'
import memoizee from 'memoizee'

export function createFilterMemoized(names: string[]) {
  const getKeywordsMemoized = memoizee(
    (search: string) => {
      const sets = search.split('|').map((set) => {
        const split = set.split(/\s+/).sort((a, b) => {
          return b.length - a.length
        })

        const escaped = split.map((keyword) => {
          const escaped = escapeRegExp(keyword)
          const regex = new RegExp(escaped, 'i')
          return { keyword, escaped, regex }
        })

        const keywords = escaped.filter((kw) => {
          return !escaped.some((otherKw) => {
            return otherKw !== kw && kw.regex.test(otherKw.keyword)
          })
        })

        const isValid = (value: string) => {
          return keywords.every((kw) => {
            return kw.regex.test(value)
          })
        }

        return { keywords, isValid }
      })

      const isValid = (value: string) => {
        return sets.some(({ isValid }) => {
          return isValid(value)
        })
      }

      const regexReplace = new RegExp(
        sets
          .flatMap((set) => {
            return set.keywords.map((kw) => {
              return kw.escaped
            })
          })
          .join('|'),

        'ig'
      )

      return { regexReplace, isValid }
    },
    { length: 1 }
  )

  const filterMemoized = memoizee(
    (search: string, value: string) => {
      search = search.trim()

      if (!search) {
        return { result: true, label: value }
      }

      if (search === value) {
        return { result: true, label: colors.green(value) }
      }

      if (names.includes(search)) {
        return { result: false, label: value }
      }

      const { regexReplace, isValid } = getKeywordsMemoized(search)

      if (!isValid(value)) {
        return { result: false, label: value }
      }

      return { result: true, label: value.replace(regexReplace, colors.yellow) }
    },
    { length: 2 }
  )

  return filterMemoized
}
