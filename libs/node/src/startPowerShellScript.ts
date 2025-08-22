import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

/**
 * Executes a PowerShell script with arguments and returns stdout/stderr.
 */
export async function startPowerShellScript(filepath: string, ...args: string[]) {
  const cmd = toCommand(filepath, args)
  const { stdout, stderr } = await execAsync(cmd, { shell: 'powershell.exe' })
  return { stdout, stderr }
}

startPowerShellScript.emitterSync = function (filepath: string, ...args: string[]) {
  const cmd = toCommand(filepath, args)
  const child = exec(cmd, { shell: 'powershell.exe' })
  return child
}

function toCommand(filepath: string, args: string[]) {
  return [filepath, ...args]
    .map((s) => {
      if (s.includes('"')) {
        // If it contains double quotes, use single quotes
        return `'${s}'`
      } else if (/\s/.test(s)) {
        // If it contains any whitespace (space, tab, etc.), use double quotes
        return `"${s}"`
      }
      return s
    })
    .join(' ')
}
