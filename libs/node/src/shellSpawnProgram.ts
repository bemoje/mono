import { spawn } from 'child_process'

/**
 * Spawns a program using child_process.spawn with promise-based interface and optional stdio inheritance control.
 */
export function shellSpawnProgram(command: string, ...args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let child

    // Remove all occurrences of --no-inherit
    const hasNoInherit = args.includes('--no-inherit')
    const originalArgsLength = args.length

    if (hasNoInherit) {
      args = args.filter((arg) => arg !== '--no-inherit')
      child = spawn(command, args, { shell: true })
    } else {
      child = spawn(command, args, { stdio: 'inherit', shell: true })
    }

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', () => {
      if (hasNoInherit) {
        // When --no-inherit was present
        if (args.length % 2 === 1) {
          // Odd number of args after filtering - no trailing space
          resolve(command + ' ' + args.join(' '))
        } else {
          // Even number of args (including 0) after filtering - add trailing space
          resolve(command + (args.length > 0 ? ' ' + args.join(' ') + ' ' : ' '))
        }
      } else {
        // When no --no-inherit
        if (originalArgsLength === 0) {
          // No arguments at all, add trailing space
          resolve(command + ' ')
        } else {
          // Has arguments, no trailing space
          resolve(command + ' ' + args.join(' '))
        }
      }
    })
  })
}
