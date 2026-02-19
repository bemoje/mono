import puppeteer from 'puppeteer'
import { scrapeProfile } from './linkedin/scrapeProfile'
import { scrapeSkills } from './linkedin/scrapeSkills'
import { scrapeRecommendations } from './linkedin/scrapeRecommendations'
import { scrapeProjects } from './linkedin/scrapeProjects'
import { scrapeEducation } from './linkedin/scrapeEducation'
import { scrapeExperience } from './linkedin/scrapeExperience'
import { CliOptions } from './types/CliOptions'
import { CHROME_PROFILE_PATH } from './constants'
import { Logger } from '@mono/node'
import { closeBrowserPages } from './utils/closeBrowserPages'

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
    await Promise.all(scrapers.map((fn) => fn(browser, options, logger)))
  } finally {
    if (!options.keepOpen) {
      await closeBrowserPages(browser)
      await browser.close()
    }
  }
}
