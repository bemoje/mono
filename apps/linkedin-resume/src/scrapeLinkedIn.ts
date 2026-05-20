import { CHROME_PROFILE_PATH } from './constants'
import type { CliOptions } from './types/CliOptions'
import type { Logger } from '@mono/node'
import { closeBrowserPages } from './utils/closeBrowserPages'
import { forEachAsync } from 'es-toolkit'
import puppeteer from 'puppeteer'
import { scrapeEducation } from './linkedin/scrapeEducation'
import { scrapeExperience } from './linkedin/scrapeExperience'
import { scrapeProfile } from './linkedin/scrapeProfile'
import { scrapeProjects } from './linkedin/scrapeProjects'
import { scrapeRecommendations } from './linkedin/scrapeRecommendations'
import { scrapeSkills } from './linkedin/scrapeSkills'

export async function scrapeLinkedIn(options: CliOptions, logger: Logger): Promise<void> {
  const browser = await puppeteer.launch({
    headless: options.headless ? 'shell' : false,
    userDataDir: CHROME_PROFILE_PATH,
    args: ['--start-maximized'],
    defaultViewport: null,
  })

  const scrapers = [
    scrapeProfile, //
    scrapeSkills,
    scrapeRecommendations,
    scrapeProjects,
    scrapeExperience,
    scrapeEducation,
  ]

  try {
    await forEachAsync(
      scrapers,
      (fn) => {
        return fn(browser, options, logger)
      },
      { concurrency: 10 }
    )
  } finally {
    if (!options.keepOpen) {
      await closeBrowserPages(browser)
      await browser.close()
    }
  }
}
