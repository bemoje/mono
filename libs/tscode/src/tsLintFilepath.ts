import { execSync } from 'node:child_process'

/**
 * Runs ESLint with auto-fix on a TypeScript file, suppressing any errors.
 * This function attempts to automatically fix linting issues in the specified file
 * using ESLint's auto-fix capability. Any errors during execution are silently ignored.
 * @param filepath - The path to the TypeScript file to lint and fix
 * @example
 * ```typescript
 * tsLintFilepath('./src/myFile.ts')
 * // Runs: yarn run eslint --fix ./src/myFile.ts
 * ```
 */
export function tsLintFilepath(filepath: string) {
  try {
    execSync('yarn run eslint --fix ' + filepath, { stdio: 'ignore' })
  } catch (_) {
    //
  }
}
