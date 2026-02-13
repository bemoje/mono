import colors from 'ansi-colors'

export interface Logger {
  start: (...args: unknown[]) => void
  done: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

/**
 * Creates a logger instance with colored output and consistent formatting.
 */
export function createLogger(name: string): Logger {
  const NAME = colors.dim(name)
  return {
    start: (...args: unknown[]) => console.info(NAME, START, ...args),
    done: (...args: unknown[]) => console.info(NAME, DONE, ...args),
    info: (...args: unknown[]) => console.info(NAME, INFO, ...args),
    warn: (...args: unknown[]) => console.warn(NAME, WARN, ...args),
    error: (...args: unknown[]) => console.error(NAME, ERROR, ...args),
    debug: (...args: unknown[]) => console.debug(NAME, DEBUG, ...args),
  }
}

const START = colors.blue('[START]')
const DEBUG = colors.magenta('[DEBUG]')
const INFO = colors.gray('[INFO]')
const DONE = colors.green('[DONE] ')
const WARN = colors.yellow('[WARN] ')
const ERROR = colors.red('[ERROR]')
