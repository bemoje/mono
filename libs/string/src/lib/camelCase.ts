import _camelCase from 'lodash/camelCase'

/**
 * Converts a string to camel case.
 * @param string - The string to convert.
 * @param overrides - Optional map of conversions.
 * @returns The camel case version of the input string.
 * @throws Error if the camel case conversion results in an empty string.
 */
export function camelCase(string: string, overrides?: Map<string, string>) {
  const cc =
    overrides?.get(string) ||
    _camelCase(
      string
        .trim()
        .split(' ')
        .map((w) => _camelCase(w))
        .join(' '),
    )
  if (!cc) throw new Error(`camelCase resolved to an empty string: "${string}"`)
  return cc
}
