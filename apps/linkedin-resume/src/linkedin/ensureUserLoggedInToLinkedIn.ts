import puppeteer from 'puppeteer'
import type { Browser } from 'puppeteer'
import { CHROME_PPROFILE_PATH } from '../constants'

/**
 * Ensures the user is logged in to LinkedIn by launching a browser instance and prompting the user to log in if necessary.
 */
export async function ensureUserLoggedInToLinkedIn(): Promise<void> {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    userDataDir: CHROME_PPROFILE_PATH,
    args: ['--start-maximized'],
    defaultViewport: null,
  })

  try {
    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/feed/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    const url = page.url()
    if (url.includes('/login') || url.includes('/authwall')) {
      console.log('You are not logged in to LinkedIn.')
      console.log('Please log in using the browser window that just opened.')
      console.log('The process will continue once you are logged in...')

      await page.waitForFunction(() => window.location.href.includes('/feed'), {
        timeout: 0,
      })

      console.log('LinkedIn login detected. You are now logged in.')
    } else {
      console.log('Already logged in to LinkedIn.')
    }
  } finally {
    for (const page of await browser.pages()) {
      await page.close().catch(() => {})
    }
    await browser.close()
  }
}
