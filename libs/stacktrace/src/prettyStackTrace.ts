import { StackFrame } from 'stacktrace-parser'
import colors from 'ansi-colors'
import { inspect } from 'node:util'
import { parse } from 'stacktrace-parser'
import upath from 'upath'

/**
 * Formats stack traces with colors and improved readability for debugging.
 */
export function prettyStackTrace(error: Error, options: { omitStack?: boolean; omitProps?: boolean } = {}) {
  return [renderMessage(error), renderProps(error, options), renderStack(error, options), ''].join('\n')
}

function renderMessage(error: Error) {
  return colors.red(`${error.name}: ${error.message}`)
}

function renderStack(error: Error, options: { omitStack?: boolean; omitProps?: boolean }) {
  if (!error.stack || options.omitStack) {
    return ''
  }

  const frames: StackFrame[] = parse(error.stack)

  // width of the first column = the longest frame.cell string
  const offset = frames.reduce((acc: number, frame) => {
    return Math.max(acc, frame.methodName.length)
  }, 0)

  const stack = frames.map((frame) => {
    if (frame.file) {
      frame.file = upath.relative(process.cwd(), frame.file.replace(/^file:[\\/]+/, ''))
    }
    const { methodName, file, lineNumber, column } = frame
    let s = '  '
    let fp: string = ''
    if (file) {
      const base = upath.basename(file)
      if (file.startsWith('node:')) {
        s += colors.gray(methodName)
        fp = colors.gray(file)
      } else if (file.includes('node_modules')) {
        s += methodName
        fp = file!.replace(base, colors.yellow(base))
      } else {
        s += methodName
        fp = file!.replace(base, colors.red(base))
      }
    }
    s += ' '.repeat(2 + offset - methodName.length)
    s += `${fp}:${lineNumber}:${column}`
    return s
  })

  return [
    colors.magenta('stack:'), //
    ...stack,
  ].join('\n')
}

function renderProps(error: Error, options: { omitStack?: boolean; omitProps?: boolean }) {
  if (options.omitProps) {
    return ''
  }
  const ignore = ['name', 'message', 'frames', 'stack']
  const keys = Object.getOwnPropertyNames(error).filter((key) => {
    return !ignore.includes(key)
  })
  if (!keys.length) {
    return ''
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = {} as any
  for (const [k, v] of Object.entries(error)) {
    if (keys.includes(k)) {
      data[k] = v
    }
  }
  // const data = _.pick(error, keys)
  return inspect(data, { colors: true })
}
