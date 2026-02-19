import type { Browser } from 'puppeteer'

export async function closeBrowserPages(browser: Browser): Promise<void> {
  for (const page of await browser.pages()) {
    await page.close().catch(() => {})
  }
}
