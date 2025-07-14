import { execSync } from 'child_process'

/**
 * Runs ESLint with auto-fix on a TypeScript file, suppressing any errors.
 */
export function tsLintFilepath(filepath: string) {
  try {
    execSync('yarn run eslint --fix ' + filepath, { stdio: 'ignore' })
  } catch (error) {
    //
  }
}
