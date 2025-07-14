/**
 * Easily perform regex 'exec' on a string. An iterable is returned which steps through the exec process and yields all the details you might need.
 * @param regex The regular expression object
 * @returns A generator that yields an object for each match.
 * @throws If the provided regex is not a RegExp instance.
 * @param string The string to perform the operation on
 * @example ```ts
 * const regex = /(?<g1>a)/g
 * const str = 'Anthony wants a girlfriend.'
 * console.log([...rexec(regex, str)])
 * // [
 * // 	{
 * //     index: 9,
 * //     lastIndex: 10,
 * //     groups: { g1: 'a' },
 * //     match: 'a',
 * //   },
 * //   {
 * //     index: 14,
 * //     lastIndex: 15,
 * //     groups: { g1: 'a' },
 * //     match: 'a',
 * //   },
 * // ]
 * ```
 */
export function rexec(regex: RegExp, string: string): RexecResult[] {
  regex = new RegExp(regex.source, regex.flags)
  const result: RexecResult[] = []
  let match
  while ((match = regex.exec(string)) !== null) {
    result.push({
      index: match.index,
      lastIndex: regex.lastIndex,
      location: findLineColumn(string, match.index),
      groups: Object.assign({}, match.groups),
      match: match[0],
    })
  }
  return result
}

export interface RexecResult {
  index: number
  lastIndex: number
  location: [line: number, col: number]
  groups: Record<string, string>
  match: string
}

function findLineColumn(content: string, index: number) {
  const lines = content.split('\n')
  const line = content.substring(0, index).split('\n').length
  lines.splice(line - 1)
  const startOfLineIndex = lines.join('\n').length + (lines.length ? 1 : 0)
  const col = index - startOfLineIndex
  return [line, col] as [number, number]
}
