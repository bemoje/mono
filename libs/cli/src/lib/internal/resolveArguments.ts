import type { Argument } from '../types'
import { last } from 'es-toolkit/array'

/** Map positional strings to argument definitions, trimming trailing undefineds */
export function resolveArguments(positionals: string[], args: Argument[]): unknown[] {
  const result = args.map((arg, index) => {
    if (arg.variadic) {
      const remaining = positionals.slice(index)
      return remaining.length > 0 ? remaining : arg.defaultValue
    }
    return positionals[index] ?? arg.defaultValue
  })
  while (result.length && last(result) === undefined) {
    result.pop()
  }
  return result
}
