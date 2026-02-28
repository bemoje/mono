import { CHROME_PROFILE_PATH } from './constants'
import type { CliOptions } from './types/CliOptions'
import type { Logger } from '@mono/node'
import { closeBrowserPages } from './utils/closeBrowserPages'
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
    await Promise.all(
      scrapers.map((fn) => {
        return fn(browser, options, logger)
      }),
    )
  } finally {
    if (!options.keepOpen) {
      await closeBrowserPages(browser)
      await browser.close()
    }
  }
}
