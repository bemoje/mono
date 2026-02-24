import { Logger } from "@mono/node";
import { toError } from "@mono/node";
import { prettyStackTrace } from '@mono/stacktrace'
import { CliOptions } from '../../types/CliOptions'
import { ResumeSection } from '../../types/ResumeSection'

export function onScrapeError(e: unknown, section: ResumeSection, options: CliOptions, logger: Logger) {
  if (e === 'ignore') return
  const error = toError(e)
  error.message = `Error scraping ${section}: ${error.message}`
  logger.error(options.debug ? prettyStackTrace(error) : error.message)
}
