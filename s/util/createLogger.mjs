/**
 * Creates a formatted logger with colored output for different log levels.
 * Used by build scripts and utilities to provide consistent logging across the monorepo.
 */
import colors from 'ansi-colors'

/**
 * Creates a logger instance with colored output and consistent formatting.
 * @param {string} name - The name/prefix for the logger
 * @returns {object} Logger object with start, done, info, warn, error, and debug methods
 */
export function createLogger(name) {
  const NAME = colors.dim(name)
  return {
    start: (...args) => console.info(NAME, START, ...args),
    done: (...args) => console.info(NAME, DONE, ...args),
    info: (...args) => console.info(NAME, INFO, ...args),
    warn: (...args) => console.warn(NAME, WARN, ...args),
    error: (...args) => console.error(NAME, ERROR, ...args),
    debug: (...args) => console.debug(NAME, DEBUG, ...args),
  }
}

const START = colors.blue('[START]')
const DEBUG = colors.magenta('[DEBUG]')
const INFO = colors.gray('[INFO]')
const DONE = colors.green('[DONE] ')
const WARN = colors.yellow('[WARN] ')
const ERROR = colors.red('[ERROR]')
