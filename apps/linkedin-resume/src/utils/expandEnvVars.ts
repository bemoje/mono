/**
 * Expands environment variables in a filepath string.
 * Supports both `$VAR` and `${VAR}` syntax.
 * Unresolved variables are replaced with an empty string.
 */
export function expandEnvVars(filepath: string): string {
  return filepath.replaceAll(/\${(\w+)}|\$(\w+)/g, (_, a, b) => {
    return process.env[a || b] ?? ''
  })
}
