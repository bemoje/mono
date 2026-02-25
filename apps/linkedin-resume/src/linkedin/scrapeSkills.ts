/* eslint-disable max-lines-per-function */
import type { Browser } from 'puppeteer'
import { CliOptions } from '../types/CliOptions'
import { Logger } from '@mono/node'
import { ResumeSkill } from '../types/Resume'
import { autoScroll } from './utils/autoScroll'
import { getPageUrl } from './utils/getPageUrl'
import { injectBrowserHelpers } from './utils/injectBrowserHelpers'
import { onScrapeError } from './utils/onScrapeError'
import { patchEsbuildHelpers } from './utils/patchEsbuildHelpers'
import { scrapeOutputJson } from './utils/scrapeOutputJson'
import { userConfigFile } from '../userConfigFile'

export async function scrapeSkills(browser: Browser, options: CliOptions, logger: Logger): Promise<void> {
  const page = await browser.newPage()

  const skills: ResumeSkill[] = []

  try {
    const username = userConfigFile.load().username
    await page.goto(getPageUrl(username, 'skills'), {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    try {
      await page.waitForSelector('.scaffold-finite-scroll__content', { timeout: 15000 })
    } catch {
      logger.warn('No skills section found or it took too long to load.')
      // eslint-disable-next-line no-throw-literal
      throw 'ignore'
    }
    await autoScroll(page)
    await patchEsbuildHelpers(page)
    await injectBrowserHelpers(page)

    const rawEntries = await page.evaluate(() => {
      const container = document.querySelector('.scaffold-finite-scroll__content')
      if (!container) {
        return []
      }
      const topLevelItems = Array.from(container.querySelector('ul')?.children ?? [])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getVisibleSpans = (globalThis as any).__getVisibleSpans as (el: Element) => string[]

      return topLevelItems.map((li) => {
        return {
          spans: getVisibleSpans(li),
          logoUrl: li.querySelector('img')?.src ?? '',
        }
      })
    })

    // Each skill entry typically has spans:
    // [0] = skill name
    // [1..] = endorsement info, associated experiences, etc.
    for (const { spans } of rawEntries) {
      if (spans.length < 1) {
        continue
      }

      const name = spans[0]
      if (!name) {
        continue
      }

      const associations = spans.slice(1).filter((s) => {
        return s !== name
      })

      skills.push({ name, associations })
    }
  } catch (e) {
    onScrapeError(e, 'skills', options, logger)
  } finally {
    await scrapeOutputJson(skills, 'skills', logger, options)
    if (!options.keepOpen) {
      await page.close()
    }
  }
}
