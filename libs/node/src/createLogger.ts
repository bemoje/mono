import colors from 'ansi-colors'
import { isPrimitive, isString } from 'es-toolkit/predicate'

export interface Logger {
  start: (...args: unknown[]) => void
  done: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  log: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

/**
 * Creates a logger instance with colored output and consistent formatting.
 */
export function createLogger(name: string): Logger {
  const NAME = name ? colors.dim.cyan(name) : name

  const START = [NAME, colors.dim.gray('[START]')].filter(Boolean)
  const DEBUG = [NAME, colors.dim.magenta('[DEBUG]')].filter(Boolean)
  const INFO = [NAME, colors.dim.gray('[INFO]')].filter(Boolean)
  const DONE = [NAME, colors.dim.green('[DONE] ')].filter(Boolean)
  const WARN = [NAME, colors.dim.yellow('[WARN] ')].filter(Boolean)
  const ERROR = [NAME, colors.dim.red('[ERROR]')].filter(Boolean)

  const grayArgs = createColoredArgs(colors.gray)
  const cyanArgs = createColoredArgs(colors.cyan)
  const yellowArgs = createColoredArgs(colors.yellow)

  return {
    start: (...args: unknown[]) => console.info(...START, ...args),
    done: (...args: unknown[]) => console.info(...DONE, ...args),
    info: (...args: unknown[]) => console.info(...INFO, ...grayArgs(args)),
    log: (...args: unknown[]) => console.log(...(NAME ? [NAME, ...args] : args)),
    warn: (...args: unknown[]) => console.warn(...WARN, ...yellowArgs(args)),
    debug: (...args: unknown[]) => console.debug(...DEBUG, ...cyanArgs(args)),
    error: (...args: unknown[]) => args.forEach((arg) => console.error(...ERROR, arg)),
  }
}

function createColoredArgs(colorFn: (str: string) => string) {
  return (args: unknown[]) => {
    return args.map((arg) => {
      if (isString(arg)) {
        if (arg === colors.stripColor(arg)) {
          return colorFn(arg)
        } else {
          return arg
        }
      } else if (isPrimitive(arg)) {
        return colorFn(String(arg))
      } else {
        return arg
      }
    })
  }
}
