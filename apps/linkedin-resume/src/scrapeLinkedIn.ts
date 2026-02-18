import puppeteer from 'puppeteer'
import { scrapeProfile } from './linkedin/scrapeProfile'
import { scrapeSkills } from './linkedin/scrapeSkills'
import { scrapeRecommendations } from './linkedin/scrapeRecommendations'
import { scrapeProjects } from './linkedin/scrapeProjects'
import { scrapeEducation } from './linkedin/scrapeEducation'
import { scrapeExperience } from './linkedin/scrapeExperience'
import { CliOptions } from './types/CliOptions'
import { CHROME_PPROFILE_PATH } from './constants'

export async function scrapeLinkedIn(options: CliOptions): Promise<void> {
  const browser = await puppeteer.launch({
    headless: options.headless ? 'shell' : false,
    userDataDir: CHROME_PPROFILE_PATH,
    args: ['--start-maximized'],
    defaultViewport: null,
  })

  try {
    await Promise.all([
      scrapeProfile(browser, options),
      scrapeSkills(browser, options),
      scrapeRecommendations(browser, options),
      scrapeProjects(browser, options),
      scrapeExperience(browser, options),
      scrapeEducation(browser, options),
    ])
  } finally {
    if (!options.keepOpen) {
      for (const page of await browser.pages()) {
        await page.close().catch(() => {})
      }
      await browser.close()
    }
  }
}
