/**
 * Extracts all TSDoc block comments from source code.
 */
export function* tsDocExtractAllComments(code: string) {
  const reStart = /^\s*\/\*\*\s*$/
  const reEnd = /^\s*\*\/\s*$/
  let lines = code.split(/\r?\n/)
  let offset = 0
  while (true) {
    const indexStart = lines.findIndex((line) => {
      return reStart.test(line)
    })
    const indexEnd = lines.findIndex((line) => {
      return reEnd.test(line)
    })
    if (indexStart !== -1 && indexEnd !== -1) {
      let nextLine: string | undefined
      if (indexEnd + 1 < lines.length) {
        nextLine = lines[indexEnd + 1]
      }
      if (nextLine?.trim() === '' && indexEnd + 2 < lines.length) {
        nextLine = lines[indexEnd + 2]
      }
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

/**
 * Gets the TSDoc summary for a specific named export.
 */
export function getNamedExportTsDocSummary(name: string, code: string): string | undefined {
  for (const c of tsDocExtractAllComments(
    code
      .split('\n')
      .map((l) => {
        return l.trim()
      })
      .filter((l) => {
        return l && !/^(@|\/\/)/.test(l)
      })
      .join('\n'),
  )) {
    if (c.nextLine?.startsWith('export default ')) {
      continue
    }
    if (!c.nextLine?.startsWith('export ')) {
      continue
    }
    if (!c.nextLine?.includes(` ${name}`)) {
      continue
    }
    return c.match
      .split('\n')
      .slice(1, -1)
      .map((l: string) => {
        return l.substring(2).trim()
      })
      .filter(Boolean)
      .join(' ')
      .split('@')[0]
      .trim()
  }
}
