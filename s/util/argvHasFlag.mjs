export function argvHasFlag(...flags) {
  return flags.some((flag) => process.argv.includes(flag))
}
