import { glob } from 'glob'
import fs from 'fs-extra'
import strip from 'strip-comments'

/**
 * Calculates the total lines of code in the project, categorizing them into different types.
 */
export async function getLinesOfCode() {
  const ts = (await glob('{libs,apps,packages}/*/src/**/*.ts')).filter(
    (p) => !/[./\\](wip|old|temp)[./\\]/.test(p),
  )
  const script = countLines(await glob('s/**/*.mjs'))
  const source = countLines(ts.filter((p) => !/[./\\](test|examples|benchmark|playground)[./\\]/.test(p)))
  const test = countLines(ts.filter((p) => p.endsWith('.test.ts')))
  const examples = countLines(ts.filter((p) => /[./\\](examples|benchmark|playground)[./\\]/.test(p)))
  const total = {
    files: source.files + test.files + examples.files + script.files,
    lines: source.lines + test.lines + examples.lines + script.lines,
  }
  return { source, test, examples, script, total }
}

function countLines(paths) {
  const arr = paths.flatMap((p) => {
    const code = fs.readFileSync(p, 'utf8')
    const noComments = strip(code)
    const compact = noComments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const lines = compact.length
    return lines
  })
  const files = paths.length
  const lines = arr.reduce((a, b) => a + b, 0)
  return { files, lines }
}
