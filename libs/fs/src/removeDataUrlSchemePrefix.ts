/**
 * Removes the data URL scheme prefix from a given string.
 * @param dataUrl - The string to remove the prefix from.
 * @returns The string with the prefix removed.
 */
export function removeDataUrlSchemePrefix(dataUrl: string) {
  return dataUrl.replace(/^data:.+;base64,/, '')
}
