import colors from 'ansi-colors'
import path from 'upath'
import { execSync } from 'child_process'

/**
 * Execute one or multiple shell commands.
 * @param commands - The command(s) to execute.
 * @param options - @see IExecuteCommandOptions
 */
export function execute(commands: string[] | string, options: IExecuteCommandOptions = {}): string {
  if (Array.isArray(commands)) {
    const out = []
    for (const command of commands) {
      out.push(execute(command, options))
    }
    return out.join('\n-------------------------------\n')
  }

  const command: string = commands
  const cwd = options.cwd ?? process.cwd()
  const silent = options.silent ?? false
  const fadedOutput = options.fadedOutput ?? false
  const noEcho = options.noEcho ?? false

  if (!noEcho) {
    const relative = path
      .relative(process.cwd(), cwd)
      .replace(/\\/g, '/')
      .replace(path.basename(cwd), colors.bold(colors.magenta(path.basename(cwd))))
    const out = `${colors.green(command)}${cwd === process.cwd() ? '' : ' in ' + colors.bold(colors.magenta(relative))}`
    console.log(silent && fadedOutput ? '  ' + colors.dim(out) : out)
  }

  const buffer = execSync(command, { stdio: silent || fadedOutput ? 'pipe' : 'inherit', cwd })
  const string = buffer && buffer.toString ? buffer.toString().trim() : ''
  if (!silent) {
    const out = string
      .split(/\r*\n/)
      .filter((line) => !fadedOutput || line.trim())
      .map((line) => (fadedOutput ? colors.dim('- ' + line).trim() : line))
      .join('\n')
      .trim()
    if (out) {
      console.log(out)
    }
  }
  return string || ''
}

interface IExecuteCommandOptions {
  /**
   * Whether to omit echo of the commands to the terminal.
   * Defaults to false.
   */
  noEcho?: boolean

  /**
   * Whether to output nothing rather than piping the stdout and stderr to the terminal as the script is running.
   * Defaults to false.
   */
  silent?: boolean

  /**
   * Output is piped directly to stdout. No edtiting of the output. Defaults to false.
   */
  fadedOutput?: boolean

  /**
   * The working directory to execute the batch script in.
   * Defaults to the current working directory.
   */
  cwd?: string
}
