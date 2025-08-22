import fs from 'fs-extra'

/**
 * Synchronous version of `updateJsonFile`.
 */
export function updateJsonFileSync<T extends object, R extends object>(
  filepath: string,
  update: (parsedFileContent: T) => R,
  defaultValue: T = {} as T,
): R {
  let content = defaultValue
  try {
    content = fs.readJsonSync(filepath)
  } catch (error) {
    //
  }
  const updated = update(content)
  fs.outputJsonSync(filepath, updated)
  return updated
}
