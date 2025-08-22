import fs from 'fs-extra'

/**
 * Synchronous version of `updateFile`.
 */
export function updateFileSync(filepath: string, update: (fileContent: string) => string): void {
  fs.ensureFileSync(filepath)
  const content = fs.readFileSync(filepath, 'utf8')
  const updated = update(content)
  fs.outputFileSync(filepath, updated)
}
