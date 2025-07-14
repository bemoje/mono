/**
 * Checks if the command line arguments contain a help flag (--help or -h).
 */
export function argvHasHelpFlag(args: string[] = process.argv): boolean {
  return !!args.find((arg) => arg === '--help' || arg === '-h')
}
