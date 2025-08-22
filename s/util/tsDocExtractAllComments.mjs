/**
 * This function takes a source string, and yields each TSDoc block comments in it.
 * @param code The source code string.
 * @returns A generator that yields each TSDoc block comment in the source code.
 * @yields Each TSDoc block comment in the source code.
 */
export function* tsDocExtractAllComments(code) {
  const reStart = /^\s*\/\*\*\s*$/
  const reEnd = /^\s*\*\/\s*$/
  let lines = code.split(/\r?\n/)
  let offset = 0
  while (true) {
    const indexStart = lines.findIndex((line) => reStart.test(line))
    const indexEnd = lines.findIndex((line) => reEnd.test(line))
    if (indexStart !== -1 && indexEnd !== -1) {
      let nextLine
      if (indexEnd + 1 < lines.length) nextLine = lines[indexEnd + 1]
      if (nextLine?.trim() === '' && indexEnd + 2 < lines.length) nextLine = lines[indexEnd + 2]
      yield {
        start: indexStart + offset,
        end: indexEnd + offset,
        match: lines.slice(indexStart, indexEnd + 1).join('\n'),
        nextLine,
      }
      lines = lines.slice(indexEnd + 1)
      offset += indexEnd + 1
    } else {
      break
    }
  }
}
