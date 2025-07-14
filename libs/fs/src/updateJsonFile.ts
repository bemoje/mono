import fs from 'fs-extra'

/**
 * Updates a JSON file by applying a transformation function to the parsed content.
 * If the file doesn't exist or can't be parsed, uses the default value.
 * Creates the file and directories if they don't exist.
 */
export async function updateJsonFile<T extends object, R extends object>(
  filepath: string,
  update: (parsedFileContent: T) => R | Promise<R>,
  defaultValue: T = {} as T,
): Promise<R> {
  let content = defaultValue
  try {
    content = await fs.readJson(filepath)
  } catch (error) {
    //
  }
  const updated = await update(content)
  await fs.outputJson(filepath, updated)
  return updated
}
