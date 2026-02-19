import puppeteer from 'puppeteer'
import type { Browser } from 'puppeteer'
import { CHROME_PROFILE_PATH } from './constants'
import { CliOptions } from './types/CliOptions'
import { Logger } from '@mono/node'
import { closeBrowserPages } from './utils/closeBrowserPages'

/**
 * Ensures the user is logged in to LinkedIn by first checking login status with a headless browser,
 * and only opening a visible browser window if the user needs to log in.
 */
export async function userLogin(options: CliOptions, logger: Logger): Promise<void> {
  if (options.headless) {
    // First, check login status with a headless browser
    const headlessBrowser: Browser = await puppeteer.launch({
      headless: 'shell',
      userDataDir: CHROME_PROFILE_PATH,
    })

    let isLoggedIn = false
    try {
      const page = await headlessBrowser.newPage()
      await page.goto('https://www.linkedin.com/feed/?locale=en_US', {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      })
      const url = page.url()
      isLoggedIn = !url.includes('/login') && !url.includes('/authwall')
    } finally {
      await closeBrowserPages(headlessBrowser)
      await headlessBrowser.close()
    }

    if (isLoggedIn) {
      logger.info('Already logged in to LinkedIn.')
      return
    }

    // Not logged in - open a visible browser for the user to log in
    logger.info('You are not logged in to LinkedIn.')
    logger.info('Please log in using the browser window that will open.')
    logger.info('The process will continue once you are logged in...')
  }

  const browser: Browser = await puppeteer.launch({
    headless: false,
    userDataDir: CHROME_PROFILE_PATH,
    args: ['--start-maximized'],
    defaultViewport: null,
  })

  try {
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/feed/?locale=en_US', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    await page.waitForFunction(() => window.location.href.includes('/feed'), {
      timeout: 0,
    })

    logger.info('LinkedIn login detected. You are now logged in.')
  } finally {
    if (!options.keepOpen) {
      await closeBrowserPages(browser)
      await browser.close()
    }
  }
}
