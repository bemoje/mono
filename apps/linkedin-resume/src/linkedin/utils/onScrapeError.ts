import { CliOptions } from '../../types/CliOptions'
import { Logger } from '@mono/node'
import { ResumeSection } from '../../types/ResumeSection'
import { prettyStackTrace } from '@mono/stacktrace'
import { toError } from '@mono/node'

export function onScrapeError(e: unknown, section: ResumeSection, options: CliOptions, logger: Logger) {
  if (e === 'ignore') {
    return
  }
  const error = toError(e)
  error.message = `Error scraping ${section}: ${error.message}`
  logger.error(options.debug ? prettyStackTrace(error) : error.message)
}
