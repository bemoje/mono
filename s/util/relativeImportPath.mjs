import upath from 'upath'

/**
 * Returns a relative module import/require path from the given path to the specified filepath.
 *
 * @param path - The filepath or the file's parent directory path in which the import statement is located. Can be absolute or relative.
 * @param filepathToImport - The filepath to module being imported. Can be absolute or relative. Will have TS extensions trimmed and index files are trimmed to the parent directory path - ie. remove `/([/]?index)?[.]m?tsx?$/i`
 *
 * @example ```ts
 * relativeImportPath('file.ts', 'toImport.ts')
 * //=> './toImport'
 * relativeImportPath('dir1/file.ts', 'dir2/file.ts')
 * //=> '../dir2/file'
 * ```
 */
export function relativeImportPath(path, filepathToImport) {
  path = upath.resolve(path)
  path = upath.basename(path).includes('.') //
    ? upath.dirname(path)
    : path

  filepathToImport = upath
    .resolve(filepathToImport) //
    .replace(/([/]?index)?[.]m?tsx?$/i, '')

  const relative = upath.relative(path, filepathToImport)
  return relative.startsWith('.') ? relative : `./${relative}`
}
