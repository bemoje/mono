/**
 * Validates option short names are single alphanumeric characters
 */
export function assertOptionShortNameIsValid(short: string): void {
  const isSingleAlphaNumericChar = /^[a-zA-Z0-9]$/.test(short)
  if (!isSingleAlphaNumericChar) {
    throw new Error(`Expected short name to be a single alpha-numeric character. Got: ${short}`)
  }
}
