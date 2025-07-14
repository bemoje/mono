import { prettyStackTrace } from './prettyStackTrace'

/**
 * Enables pretty stack trace formatting for uncaught exceptions.
 */
export function enablePrettyStackTrace() {
  process.prependListener('uncaughtException', (e) => {
    console.error(prettyStackTrace(e))
  })
}
