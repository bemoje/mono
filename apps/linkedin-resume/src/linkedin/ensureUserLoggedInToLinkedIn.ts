import puppeteer from 'puppeteer'
import type { Browser } from 'puppeteer'
import { CHROME_PROFILE_PATH } from '../constants'

/**
 * Ensures the user is logged in to LinkedIn by first checking login status with a headless browser,
 * and only opening a visible browser window if the user needs to log in.
 */
export async function ensureUserLoggedInToLinkedIn(): Promise<void> {
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
    for (const page of await headlessBrowser.pages()) {
      await page.close().catch(() => {})
    }
    await headlessBrowser.close()
  }

  if (isLoggedIn) {
    console.log('Already logged in to LinkedIn.')
    return
  }

  // Not logged in - open a visible browser for the user to log in
  console.log('You are not logged in to LinkedIn.')
  console.log('Please log in using the browser window that will open.')
  console.log('The process will continue once you are logged in...')

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

    console.log('LinkedIn login detected. You are now logged in.')
  } finally {
    for (const page of await browser.pages()) {
      await page.close().catch(() => {})
    }
    await browser.close()
  }
}
