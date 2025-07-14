import { exec } from 'child_process'

/**
 * Helper function to execute a shell command and return stdout and stderr without throwing on error.
 * If there was an error and nothing was sent to stderr, the error.message takes its place.
 */
export function execOutput(command: string): Promise<{ stdout?: string; stderr?: string }> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ stdout, stderr: stderr || error?.message })
    })
  })
}
