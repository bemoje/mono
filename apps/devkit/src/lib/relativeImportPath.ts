import upath from 'upath'

/**
 * Returns a relative module import path from one file to another.
 */
export function relativeImportPath(path: string, filepathToImport: string): string {
  path = upath.resolve(path)
  path = upath.basename(path).includes('.') ? upath.dirname(path) : path

  filepathToImport = upath.resolve(filepathToImport).replace(/([/]?index)?[.]m?tsx?$/i, '')

  const relative = upath.relative(path, filepathToImport)
  return relative.startsWith('.') ? relative : `./${relative}`
}
