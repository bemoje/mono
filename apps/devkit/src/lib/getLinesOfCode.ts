import { glob } from 'glob'
import fs from 'fs-extra'
import strip from 'strip-comments'

/**
 * Calculates the total lines of code in the project by category.
 */
export async function getLinesOfCode() {
  const ts = (await glob('{libs,apps,packages}/*/{src,examples}/**/*.ts')).filter(
    (p) => !/[./\\](wip|old|temp|playground)[./\\]/.test(p),
  )
  const source = countLines(ts.filter((p) => !/[./\\](test|examples|benchmark)[./\\]/.test(p)))
  const test = countLines(ts.filter((p) => p.endsWith('.test.ts')))
  const examples = countLines(ts.filter((p) => /[./\\](examples|benchmark)[./\\]/.test(p)))
  const total = {
    files: source.files + test.files + examples.files,
    lines: source.lines + test.lines + examples.lines,
  }
  return { source, test, examples, total }
}

function countLines(paths: string[]) {
  const arr = paths.flatMap((p) => {
    const code = fs.readFileSync(p, 'utf8')
    const noComments = strip(code, { block: true, line: true })
    const compact = noComments
      .split('\n')
      .map((line: string) => line.trim())
      .filter(Boolean)
    return compact.length
  })
  const files = paths.length
  const lines = arr.reduce((a, b) => a + b, 0)
  return { files, lines }
}
