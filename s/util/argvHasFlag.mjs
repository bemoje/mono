/**
 * Checks if any of the provided flags are present in process.argv.
 * @param {...string} flags - Command line flags to check for
 * @returns {boolean} True if any of the flags are found in process.argv
 */
export function argvHasFlag(...flags) {
  return flags.some((flag) => process.argv.includes(flag))
}
