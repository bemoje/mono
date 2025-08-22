/**
 * Extracts the TSDoc summary comment for a named export from TypeScript source code.
 */
import { tsDocExtractAllComments } from './tsDocExtractAllComments.mjs'

/**
 * Gets the TSDoc summary for a specific named export.
 * @param {string} name - The name of the export to find
 * @param {string} code - The TypeScript source code
 * @returns {string|undefined} The TSDoc summary or undefined if not found
 */
export function getNamedExportTsDocSummary(name, code) {
  for (const c of tsDocExtractAllComments(
    code
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^(@|\/\/)/.test(l))
      .join('\n'),
  )) {
    if (c.nextLine.startsWith('export default ')) continue
    if (!c.nextLine.startsWith('export ')) continue
    if (!c.nextLine.includes(` ${name}`)) continue
    return c.match
      .split('\n')
      .slice(1, -1)
      .map((l) => l.substring(2).trim())
      .filter(Boolean)
      .join(' ')
      .split('@')[0]
      .trim()
  }
}
