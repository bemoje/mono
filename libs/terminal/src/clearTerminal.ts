import { execSync } from 'child_process'

/**
 * Clears the terminal screen using the system's clear command.
 */
export function clearTerminal() {
  execSync('cls', { stdio: 'inherit' })
}
